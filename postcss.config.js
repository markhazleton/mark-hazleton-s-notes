import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

const ensureFrom = () => ({
  postcssPlugin: "ensure-from",
  Once(root, { result }) {
    if (!result.opts.from && root.source?.input?.file) {
      result.opts.from = root.source.input.file;
    }
  },
});
ensureFrom.postcss = true;

export default {
  plugins: [ensureFrom(), tailwindcss(), autoprefixer()],
};
