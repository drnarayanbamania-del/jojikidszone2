import { PriceDropAlert, Product } from '../types';

const STORAGE_KEY = 'joji_price_drop_alerts';
const LAST_EMAIL_KEY = 'joji_last_alert_email';

export const getStoredAlerts = (): PriceDropAlert[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed reading price alerts from localStorage', err);
    return [];
  }
};

export const getAlertForProduct = (productId: string): PriceDropAlert | undefined => {
  const alerts = getStoredAlerts();
  return alerts.find((a) => a.productId === productId);
};

export const getLastUsedEmail = (): string => {
  try {
    return localStorage.getItem(LAST_EMAIL_KEY) || '';
  } catch {
    return '';
  }
};

export const savePriceAlert = (
  data: Omit<PriceDropAlert, 'id' | 'createdAt'>
): PriceDropAlert => {
  const alerts = getStoredAlerts();
  // Remove existing alert for this product if any
  const filtered = alerts.filter((a) => a.productId !== data.productId);

  const newAlert: PriceDropAlert = {
    ...data,
    id: `alert_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    notified: false,
  };

  const updated = [newAlert, ...filtered];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(LAST_EMAIL_KEY, data.email);
  } catch (err) {
    console.error('Failed saving price alert', err);
  }

  return newAlert;
};

export const removePriceAlert = (productId: string): void => {
  const alerts = getStoredAlerts();
  const updated = alerts.filter((a) => a.productId !== productId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed removing price alert', err);
  }
};

export const checkTriggeredAlerts = (products: Product[]): { alert: PriceDropAlert; product: Product }[] => {
  const alerts = getStoredAlerts();
  const triggered: { alert: PriceDropAlert; product: Product }[] = [];

  for (const alert of alerts) {
    const product = products.find((p) => p.id === alert.productId);
    if (product && product.price <= alert.targetPrice) {
      triggered.push({ alert, product });
    }
  }

  return triggered;
};
