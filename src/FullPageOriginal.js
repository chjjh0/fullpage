import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import styled from "styled-components/macro";

const helper = {
  getDelta(e) {
    // console.log("getDelta", e);
    if (e.wheelDelta) {
      return e.wheelDelta;
    } else {
      return -e.detail;
    }
  },
  throttle(method, delay, context) {
    // console.log("throttle 안: ", method);
    let inThrottle = false;

    return function () {
      if (!inThrottle) {
        inThrottle = true;
        method.apply(context, arguments);
        setTimeout(() => {
          inThrottle = false;
        }, delay);
      }
    };
  },
  debounce: (method, delay, context) => {
    let inDebounce;

    return function () {
      clearTimeout(method.inDebounce);
      inDebounce = setTimeout(() => {
        method.apply(context, arguments);
      }, delay);
    };
  },
};

export default function FullPageOriginal() {
  let currentPageNumber = useRef(1);
  let totalPageNumber = useRef(3);
  let pages = useRef(null);
  let viewHeight = useRef(document.documentElement.clientHeight);
  let navDotRef = useRef(null);
  // console.log("navDotRef: ", navDotRef);
  console.log("currentPageNumber: ", currentPageNumber);
  // console.log("pages: ", pages);
  // console.log("viewHeight: ", viewHeight);

  const mouseScroll = (e) => {
    // console.log("mouseScroll: ", e);
    let delta = helper.getDelta(e);
    // console.log("delta: ", delta);
    if (delta < 0) {
      scrollDown();
    } else {
      scrollUp();
    }
  };
  const scrollUp = () => {
    if (currentPageNumber.current !== 1) {
      pages.style.top =
        -viewHeight.current * (currentPageNumber.current - 2) + "px";
      currentPageNumber.current--;
      updateNav();
      textFadeInOut();
    }
  };
  const scrollDown = () => {
    if (currentPageNumber.current !== totalPageNumber.current) {
      pages.style.top = -viewHeight.current * currentPageNumber.current + "px";
      currentPageNumber.current++;
      updateNav();
      textFadeInOut();
    }
  };
  const scrollTo = (targetPageNumber) => {
    while (currentPageNumber.current !== targetPageNumber) {
      if (currentPageNumber.current > targetPageNumber) {
        scrollUp();
      } else {
        scrollDown();
      }
    }
  };

  const createNav = () => {
    // console.log("createNav: ", createNav);
    const pageNav = document.createElement("div");
    pageNav.className = "nav-dot-container";
    pages.appendChild(pageNav);

    for (let i = 0; i < totalPageNumber.current; i++) {
      pageNav.innerHTML += '<p class="nav-dot"><span></span></p>';
    }

    const navDots = document.getElementsByClassName("nav-dot");
    navDotRef = Array.prototype.slice.call(navDots);
    // console.log("여기요: ", navDotRef[0]);
    navDotRef[0].classList.add("dot-active");
    navDotRef.forEach((e, index) => {
      // console.log("여기네: ", e);

      e.addEventListener("click", (event) => {
        scrollTo(index + 1);
        navDotRef.forEach((e) => {
          e.classList.remove("dot-active");
        });
        e.classList.add("dot-active");
      });
    });
  };
  const updateNav = () => {
    navDotRef.forEach((e) => {
      e.classList.remove("dot-active");
    });
    navDotRef[currentPageNumber.current - 1].classList.add("dot-active");
  };
  const resize = () => {
    viewHeight = document.documentElement.clientHeight;
    pages.style.height = viewHeight.current + "px";
    pages.style.top =
      viewHeight.current * (currentPageNumber.current - 1) + "px";
  };
  const textFadeInOut = () => {
    const containersDom = document.getElementsByClassName("text-container");
    let textContainers = Array.prototype.slice.call(containersDom);
    textContainers.forEach((e) => {
      e.classList.remove("in-sight");
    });
    let textContainerInSight = textContainers[currentPageNumber.current - 1];
    // console.log("textContainerInSight: ", textContainerInSight);
    textContainerInSight.classList.add("in-sight");
  };

  // const init = () => {};

  useEffect(() => {
    pages = document.getElementById("all-pages");
    const context = {
      currentPageNumber: currentPageNumber.current,
      navDots: navDotRef,
      pages: pages,
      totalPageNumber: totalPageNumber.current,
      viewHeight: viewHeight.current,
    };
    // console.log("context: ", context);
    let handleMouseWheel = (e) =>
      helper.throttle(() => mouseScroll(e), 500, context)();
    // console.log("handleMouseWheel: ", handleMouseWheel);
    let handleResize = helper.debounce(resize, 500, context);
    pages.style.height = viewHeight.current + "px";
    createNav();
    textFadeInOut();

    // console.log(navigator);
    document.addEventListener("wheel", (e) => {
      // console.log("111 scroll!!!", e);
      handleMouseWheel(e);
    });
    window.addEventListener("resize", () => {
      // console.log("resize");
      handleResize();
    });
  }, []);

  return (
    <Container>
      <div id="all-pages">
        <section className="page">
          <div className="text-container">
            <h2>The first page</h2>
            <p>
              Try: Scroll the page; Click the white dots on the right side;
              Resize the window; View it on a mobile browser.
            </p>
          </div>
        </section>

        <section className="page">
          <div className="text-container">
            <h2>The second page</h2>
            <p>
              Try: Scroll the page; Click the white dots on the right side;
              Resize the window; View it on a mobile browser.
            </p>
          </div>
        </section>

        <section className="page">
          <div className="text-container">
            <h2>The third page</h2>
            <p>
              Try: Scroll the page; Click the white dots on the right side;
              Resize the window; View it on a mobile browser.
            </p>
          </div>
        </section>
      </div>
    </Container>
  );
}

const Container = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;

  #all-pages {
    position: relative;
    top: 0;
    transition: all 800ms ease;
    /* height set by js */
  }
  .page {
    height: 100%;
    width: 100%;
  }
  #all-pages .page:nth-child(1) {
    background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
      url(https://raw.githubusercontent.com/Juuggo/FELab/master/fullscreen-scroll/images/bg1.jpg)
        center / cover;
  }
  #all-pages .page:nth-child(2) {
    background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
      url(https://raw.githubusercontent.com/Juuggo/FELab/master/fullscreen-scroll/images/bg2.jpg)
        center / cover;
  }
  #all-pages .page:nth-child(3) {
    background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
      url(https://raw.githubusercontent.com/Juuggo/FELab/master/fullscreen-scroll/images/bg3.jpg)
        center / cover;
  }
  .text-container {
    font-family: sans-serif, helvetica, arial;
    color: white;
    text-align: center;
    position: relative;
    top: 50%;
    margin: 0 40px;
    opacity: 0;
    visibility: visible;
    transform: translateY(-50%);
    transition: all 3s ease;
  }
  .text-container.in-sight {
    opacity: 1;
    visibility: visible;
  }
  .text-container h2 {
    font-size: 6vh;
    text-transform: uppercase;
  }
  .text-container p {
    font-size: 2vh;
    padding: 1em 0;
  }
  .nav-dot-container {
    position: fixed;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }
  .nav-dot {
    width: 20px;
    height: 30px;
    padding: 20px 0px;
    margin: auto;
  }
  .nav-dot span {
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: white;
    transition: all 200ms ease;
    margin: auto;
  }
  .nav-dot span:hover {
    width: 12px;
    height: 12px;
  }
  .nav-dot.dot-active span {
    width: 15px;
    height: 15px;
  }
`;
