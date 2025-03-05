const MenubarApp = () => {
  return (
    <>
      <nav className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <a
                  href="https://facebook.com/murshedkoli"
                  className="text-white"
                >
                  Murshed Al Main
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-4">
                <a
                  href="/"
                  className="text-white hover:bg-white hover:text-black rounded-lg p-2"
                >
                  Home
                </a>
                <a
                  href="/website"
                  className="text-white hover:bg-white hover:text-black rounded-lg p-2"
                >
                  Add Website
                </a>
                <a
                  href="/category"
                  className="text-white hover:bg-white hover:text-black rounded-lg p-2"
                >
                  Add Category
                </a>
                {/* <a
                  href="/"
                  className="text-white hover:bg-white hover:text-black rounded-lg p-2"
                >
                  Add Category
                </a> */}
                <a
                  href="/"
                  className="text-white hover:bg-white hover:text-black rounded-lg p-2"
                >
                  যে কোন প্রয়োজনে- 01781981486
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default MenubarApp;
