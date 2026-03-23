function PageLayout({ children }) {
    return (
      <div className="min-h-screen bg-noir-950 text-white selection:bg-crimson-800">
        <div className="max-w-xl mx-auto px-4 py-8 sm:px-6">
          {children}
        </div>
      </div>
    );
  }
  
  export default PageLayout;