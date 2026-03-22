import { playwrightLauncher } from '@web/test-runner-playwright'
import { sendKeysPlugin } from '@web/test-runner-commands/plugins'

export default {
  files: 'test/**/*.test.js',
  browsers: [playwrightLauncher({ product: 'chromium' })],
  plugins: [sendKeysPlugin()],
  nodeResolve: true,
}
