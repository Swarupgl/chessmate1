import * as React from 'react';

export const PawnIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 45 45"
    {...props}
  >
    <g
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
    >
      <path
        d="M22.5 11.63V6"
      />
      <path
        d="M22.5 25s4-4.5 4-8.5a4 4 0 10-8 0c0 4 4 8.5 4 8.5z"
        strokeLinecap="butt"
      />
      <path
        d="M22.5 25h-9.5c0 4.42 3.58 8 8 8s8-3.58 8-8h-6.5z"
        strokeLinecap="butt"
      />
      <path
        d="M13.5 33h18v2h-18z"
        strokeLinecap="butt"
      />
       <path
        d="M11.5 35h22v4h-22z"
      />
    </g>
  </svg>
);
