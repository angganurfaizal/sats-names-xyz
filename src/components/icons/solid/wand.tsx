import classNames from "classnames";
import React from "react";

export interface IconProps {
  className?: string;
}

const IconWandSolid = ({ className = "w-6 h-6" }: IconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames([className])}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.2374 10.7626C13.5303 11.0554 13.5303 11.5303 13.2374 11.8232L4.75216 20.3085C4.45927 20.6014 3.98439 20.6014 3.6915 20.3085C3.39861 20.0156 3.39861 19.5407 3.6915 19.2478L12.1768 10.7626C12.4697 10.4697 12.9445 10.4697 13.2374 10.7626Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.0653 3.66932C19.8475 3.40787 20.5921 4.15249 20.3307 4.93475L19.5815 7.17619L21.0087 9.0825C21.5074 9.7486 21.0219 10.6969 20.1899 10.6817L17.8306 10.6385L16.478 12.5586C16.0014 13.2351 14.9561 13.073 14.7069 12.2838L13.9891 10.0109L11.7162 9.29309C10.927 9.04386 10.7649 7.9986 11.4415 7.52199L13.3615 6.16946L13.3184 3.81006C13.3031 2.9781 14.2514 2.49258 14.9175 2.99128L16.8238 4.41849L19.0653 3.66932Z"
      />
    </svg>
  );
};

export default IconWandSolid;
