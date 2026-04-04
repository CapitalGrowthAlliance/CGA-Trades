import { Router, Request } from 'express';
import { adminStorage } from '../firebase-admin';

const router = Router();

// Mock userId for consistent behavior without auth
const MOCK_USER_ID = 'user-123';

// Get user's storage info (Protected Route)
router.get('/', async (req: Request, res) => {
  try {
    const bucket = adminStorage.bucket();
    const userId = MOCK_USER_ID;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [files] = await bucket.getFiles({ prefix: `users/${userId}/` });
    const fileNames = files.map(file => file.name.split('/').pop());

    res.json({
      message: 'Storage accessed successfully',
      storagePath: `users/${userId}/`,
      files: fileNames
    });
  } catch (error) {
    console.error('Storage error:', error);
    res.status(500).json({ error: 'Server error accessing storage' });
  }
});

// Example of uploading/creating a file in user's storage
router.post('/file', async (req: Request, res) => {
  try {
    const bucket = adminStorage.bucket();
    const userId = MOCK_USER_ID;
    const { filename, content } = req.body;

    if (!userId || !filename || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const filePath = `users/${userId}/${filename}`;
    const file = bucket.file(filePath);

    await file.save(content);

    res.status(201).json({ message: 'File created successfully', filename });
  } catch (error) {
    console.error('File creation error:', error);
    res.status(500).json({ error: 'Server error creating file' });
  }
});

export default router;
