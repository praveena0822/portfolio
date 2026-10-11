export default function Footer({ name }) {
  return (
    <footer className="py-8 text-center text-sm text-muted dark:text-muted-dark">
      © {new Date().getFullYear()} {name}. All rights reserved.
    </footer>
  );
}
