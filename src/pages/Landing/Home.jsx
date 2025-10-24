import { NavLink } from "react-router";
import About from "./About";
import Navigation from "./components/Navigation";

export default function Home() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen scroll-smooth">
        <section
          className="h-screen flex items-center justify-center text-center"
          id="home"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-center flex-col space-y-10 order-2 md:order-1">
              <img
                src="/posimlogo.png"
                alt=""
                className="w-72 h-10 object-cover"
              />
              <p className="text-sm md:text-lg text-gray-600 dark:text-gray-100 max-w-2xl mx-auto">
                A modern Point of Sale and Inventory Management system built to
                help businesses manage products, track sales, and streamline
                operations — all in one intuitive dashboard.
              </p>

                <div className="w-full flex justify-center">
                    <NavLink
                    to="/login"
                    className="bg-gradient-to-r from-[#032f30] to-[#036c6e] text-white px-6 py-3 rounded-xl hover:bg-gradient-to-l hover:from-[#032f30] hover:to-[#036c6e] transition-all duration-300 cursor-pointer"
                    >
                    Get Started
                    </NavLink>
                </div>
            </div>

            <div className="flex items-center order-1 md:order-2 mb-4 md:mb-0">
                <img src="/posim_mock.png" alt="" className="w-xl mx-auto"/>
            </div>
          </div>
        </section>
      </div>
      <About />
    </>
  );
}
