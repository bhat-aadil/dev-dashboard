import Typewriter from "typewriter-effect";

function Greet() {
  return (
    <div className="h-screen flex justify-center mt-64">
      <Typewriter
        options={{
          strings: ["Hello Dev! What Are You Building Today"],
          autoStart: true,
          cursor: "_",
          wrapperClassName: "custom-text",
          cursorClassName: "custom-cursor",
          delay: 80,
          deleteSpeed: 40,
        }}
      />
    </div>
  );
}

export default Greet;
