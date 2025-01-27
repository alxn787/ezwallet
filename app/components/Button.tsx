"use client";
export const Button = ({ insidevalue, onClick }: { 
  insidevalue: React.ReactNode; 
  onClick: () => void; 
}) => {
  return (
    <button
      type="button"
      onClick={onClick} 
      className=" bg- border border-gray-300 focus:outline-none hover:bg-blue-950 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
    >
      {insidevalue}
    </button>
  );
};

export const SecondaryButton = ({ insidevalue, onClick }: { 
  insidevalue: React.ReactNode; 
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick} 
      className="text-white bg-black border border-gray-300 focus:outline-none hover:bg-blue-950  font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2"
    >
      {insidevalue}
    </button>
  );
};

export const NextButton = ({active,insidevalue, onClick}: { 
    active: boolean;
    insidevalue: React.ReactNode; 
    onClick: () => void;
  }) => {
    return (
      <button
        type="button"
        onClick={onClick} 
        className={`text-white border border-gray-300 focus:outline-none hover:bg-blue-600 rounded-lg text-md px-15 w-32 font-semibold py-2.5 me-2 ${active? "bg-blue-500":"bg-blue-400"}`}>
        {insidevalue}
      </button>
    );
  };
