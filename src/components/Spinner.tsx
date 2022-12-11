import Image from "next/image";
import * as React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className='w-full h-full flex items-center justify-center opacity-40'>
      <Image src="/three-dots.svg" alt="loader" width={30} height={20} priority={true}/>
    </div>
  );
};

export default LoadingSpinner;