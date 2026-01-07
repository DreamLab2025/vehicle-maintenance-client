export function maskEmail(email: string) {
  if (!email) return '';
  const [name, domain] = email.split('@');
  if (!domain) return email;
  const visible = name.slice(0, 3);
  const masked = '*'.repeat(Math.max(0, name.length - 3));
  return `${visible}${masked}@${domain}`;
}
