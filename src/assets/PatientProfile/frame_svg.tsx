type fillType = {
  fill: string;
  rect: string;
};
function Frame_svg({ fill, rect }: fillType) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 41 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Frame 2524">
        <rect width="40" height="40" rx="20.5" fill={rect} />
        <g id="Group">
          <path
            id="Vector"
            d="M20.9668 12.4888H21.757C23.3881 12.4888 24.7239 13.8231 24.7239 15.4557V20.9924C24.7239 22.6236 23.3881 23.9593 21.757 23.9593H20.9668C19.3343 23.9593 18 22.6236 18 20.9924V15.4557C18 13.8231 19.3343 12.4888 20.9668 12.4888Z"
            stroke={fill}
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="Vector_2"
            d="M21.4107 25.1846C21.7923 25.1846 22.1033 25.4956 22.1033 25.8772V27.9536C22.1033 28.3339 21.7923 28.6448 21.4107 28.6448C21.0304 28.6448 20.7195 28.3339 20.7195 27.9536V25.8772C20.7195 25.4956 21.0304 25.1846 21.4107 25.1846Z"
            stroke={fill}
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="Vector_3"
            d="M21.2029 33.0001C20.1004 30.9873 21.921 30.8417 21.2934 28.6338"
            stroke={fill}
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="Vector_4"
            d="M18.7689 16.2949H23.268H24.7239"
            stroke={fill}
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="Vector_5"
            d="M23.487 17.9761H24.7238"
            stroke={fill}
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="Vector_6"
            d="M22.4991 19.7739H24.1797H24.7239"
            stroke={fill}
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="Vector_7"
            d="M21.4305 12.015C22.0072 12.015 22.4779 11.338 22.4779 10.5082C22.4779 9.67707 22.0072 9 21.4305 9C20.8538 9 20.3831 9.67707 20.3831 10.5082C20.3831 11.338 20.8538 12.015 21.4305 12.015Z"
            stroke={fill}
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}

export default Frame_svg;
