import { SafeBase64Pipe } from './safe-base64.pipe';

describe('SafeBase64Pipe', () => {
  it('create an instance', () => {
    const pipe = new SafeBase64Pipe();
    expect(pipe).toBeTruthy();
  });
});
