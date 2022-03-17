export default function asssertServerOnly() {
  if (typeof window !== 'undefined') {
    throw new Error('This file must not be included on the client side.');
  }
}
