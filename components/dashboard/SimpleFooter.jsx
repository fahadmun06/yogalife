const SimpleFooter = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-4 border-t border-gray-100 dark:border-zinc-800 flex justify-center items-center text-sm text-gray-400 dark:text-zinc-500 font-poppins mt-auto">
      <p>© {currentYear} Butterfly Sanctuary. All rights reserved.</p>
    </footer>
  );
};

export default SimpleFooter;
