type fillType = {
    fill: string;
    rect: string;
  };
  function Syrups_svg({ fill, rect }: fillType) {
    return (
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="9081125_medicine_syrup_icon 1" clip-path="url(#clip0_5256_18119)">
        <rect width="30" height="30" rx="20.5" fill={rect} />
  
          <path
            id="Vector"
            d="M10 26.25H20C20.3315 26.25 20.6495 26.1183 20.8839 25.8839C21.1183 25.6495 21.25 25.3315 21.25 25V12.5C21.25 11.5054 20.8549 10.5516 20.1517 9.84835C19.4484 9.14509 18.4946 8.75 17.5 8.75H12.5C11.5054 8.75 10.5516 9.14509 9.84835 9.84835C9.14509 10.5516 8.75 11.5054 8.75 12.5V25C8.75 25.3315 8.8817 25.6495 9.11612 25.8839C9.35054 26.1183 9.66848 26.25 10 26.25Z"
            stroke={fill}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="Vector_2"
            d="M12.5 17.5H17.5"
            stroke={fill}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="Vector_3"
            d="M15 15V20"
            stroke={fill}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="Vector_4"
            d="M12.5 8.75V5C12.5 4.66848 12.6317 4.35054 12.8661 4.11612C13.1005 3.8817 13.4185 3.75 13.75 3.75H16.25C16.5815 3.75 16.8995 3.8817 17.1339 4.11612C17.3683 4.35054 17.5 4.66848 17.5 5V8.75"
            stroke={fill}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_5256_18119">
            <rect width="30" height="30" fill={rect} />
          </clipPath>
        </defs>
      </svg>
    );
  }
  
  export default Syrups_svg;
  