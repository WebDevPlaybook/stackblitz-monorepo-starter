import { createRoot } from 'react-dom/client';
import { Button } from '@org/ui-components';

createRoot(document.getElementById('root')!).render(
  <Button onClick={() => alert('Hello')}>Hello</Button>
);
