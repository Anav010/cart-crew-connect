
import { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  cartName: string;
}

const ShareDialog = ({ isOpen, onClose, shareUrl, cartName }: ShareDialogProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share this link with friends to collaborate on your cart.",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join my shared cart: ${cartName}`,
          text: `Help me shop! Join my shared cart "${cartName}" to add items and chat.`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-walmart-blue" />
            Share Cart
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="share-url">Share this link with friends:</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="share-url"
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button 
                onClick={handleCopyLink} 
                variant="outline"
                className="flex-shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Friends can view and edit the cart</p>
            <p>• Chat with your group in real-time</p>
            <p>• Split costs automatically</p>
            <p>• Get AI-powered suggestions together</p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleShare}
              className="flex-1 bg-walmart-blue hover:bg-walmart-light-blue"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Cart
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
