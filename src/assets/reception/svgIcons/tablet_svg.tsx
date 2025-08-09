type fillType = {
    fill: string;
    rect?: string;
  };
  function Tablet_svg({ fill,rect }: fillType) {
    return (
      <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="3668843_drugs_medicine_pills_icon 1">
      <rect width="30" height="30" rx="20.5" fill={rect} />
        <path
          id="Vector"
          d="M13.5 23.8C10.9 25.7 7.30001 25.4 4.90001 23.1C2.30001 20.5 2.30001 16.3 4.90001 13.7L13.6 5C15 3.6 16.7 3 18.4 3C20.1 3 21.8 3.6 23.1 4.9C25.4 7.2 25.7 10.9 23.8 13.5C22.9 13.2 22 13 21 13C20.7 13 20.4 13 20.1 13.1L20.9 12.3C22.3 10.9 22.3 8.6 20.9 7.2C20.2 6.4 19.3 6 18.4 6C17.4 6 16.5 6.4 15.8 7.1L12 10.8L15.9 14.7C14.1 16.2 12.9 18.4 12.9 20.9C13 22 13.2 22.9 13.5 23.8ZM24.5 16.1C23.5 15.4 22.3 15 21 15C17.7 15 15 17.7 15 21C15 22.3 15.4 23.5 16.1 24.5L24.5 16.1ZM25.9 17.5L17.5 25.9C18.5 26.6 19.7 27 21 27C24.3 27 27 24.3 27 21C27 19.7 26.6 18.5 25.9 17.5Z"
          fill={fill}
        />
      </g>
    </svg>
    );
  }
  
  export default Tablet_svg;
  