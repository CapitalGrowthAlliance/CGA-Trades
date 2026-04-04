import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Copy, Check, Info } from 'lucide-react';

interface CryptoWalletCardProps {
  name: string;
  network: string;
  address: string;
  logo: string;
  qrLogo?: string;
}

const CryptoWalletCard: React.FC<CryptoWalletCardProps> = ({ name, network, address, logo, qrLogo }) => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    const options = {
      width: 200,
      height: 200,
      type: 'svg' as const,
      data: address,
      image: qrLogo || logo,
      dotsOptions: {
        color: '#0F172A',
        type: 'rounded' as const
      },
      backgroundOptions: {
        color: '#ffffff',
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 5,
        imageSize: 0.2,
        hideBackgroundDots: false
      },
      qrOptions: {
        errorCorrectionLevel: 'H' as const
      }
    };

    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling(options);
    } else {
      qrCode.current.update(options);
    }

    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.current.append(qrRef.current);
    }
  }, [address, logo]);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-bg-secondary border border-border-light rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* QR Code Section */}
        <div className="shrink-0 bg-white p-2 rounded-xl border border-border-light shadow-inner">
          <div ref={qrRef} className="w-[200px] h-[200px]" />
        </div>

        {/* Details Section */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-text-primary">{name}</h3>
              <p className="text-sm font-medium text-accent-primary uppercase tracking-wider">{network}</p>
            </div>
            <img src={logo} alt={name} className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-tighter">Wallet Address</label>
            <div className="flex items-center gap-2 bg-bg-primary border border-border-color rounded-xl p-3 group transition-colors hover:border-accent-primary/50">
              <code className="flex-1 text-sm text-text-primary break-all font-mono leading-relaxed">
                {address}
              </code>
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg bg-bg-secondary border border-border-light text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-all shrink-0"
                title="Copy Address"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-tight text-amber-600 dark:text-amber-400 font-medium">
              Send only <span className="font-bold">{name}</span> via the <span className="font-bold uppercase">{network}</span> network. 
              Wrong network may result in permanent loss.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoWalletCard;
