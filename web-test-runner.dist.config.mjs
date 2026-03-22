import { playwrightLauncher } from '@web/test-runner-playwright'
import { sendKeysPlugin } from '@web/test-runner-commands/plugins'

export default {
  files: 'test/**/*.test.js',
  browsers: [playwrightLauncher({ product: 'chromium' })],
  plugins: [
    sendKeysPlugin(),
    {
      name: 'use-dist',
      transform(context) {
        if (context.url.endsWith('.test.js')) {
          return {
            body: context.body.replace(
              "import '../wc-date-input.js'",
              "import '../dist/wc-date-input.min.js'"
            ),
          }
        }
      },
    },
  ],
  nodeResolve: true,
}
