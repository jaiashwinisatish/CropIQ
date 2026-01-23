import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl">{t('appName')}</span>
                <span className="text-[10px] text-muted-foreground -mt-1">{t('tagline')}</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('heroSubtitle')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[{ label: t('dashboard'), path: '/dashboard' }, 
                { label: t('advisory'), path: '/advisory' }, 
                { label: t('planning'), path: '/planning' }, 
                { label: t('about'), path: '/about' }].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">For Users</h4>
            <ul className="space-y-2">
              {['Farmers', 'FPOs', 'Agri-Enterprises', 'Government Bodies', 'NGOs'].map((item) => (
                <li key={item}>
                  <Link
                    to="/about"
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-primary" />
                support@cropiq.in
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 text-primary" />
                1800-XXX-XXXX (Toll Free)
              </li>
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>AgriTech Hub, Gurugram,<br />Haryana, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 CropIQ. Made with 💚 for Indian farmers.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-muted-foreground hover:text-primary text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-primary text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
