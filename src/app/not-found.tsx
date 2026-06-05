import { baseUrl } from '@/config/site-config';
import { redirect } from 'next/navigation';

export default function NofFound() {
  redirect(baseUrl);
  return <div>not found</div>;
}
