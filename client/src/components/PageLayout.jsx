function PageLayout({ children }) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="max-w-6xl mx-auto p-6">
          {children}
        </div>
      </div>
    );
  }
  
  export default PageLayout;