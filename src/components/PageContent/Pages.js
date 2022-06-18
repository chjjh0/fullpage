import { intro } from "./introduce";
import styled from "styled-components";
import { useEffect, useRef } from "react";

const helper = {
  getDelta(e) {
    console.log("getDelta", e);
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

const Pages = () => {
  let currentPageNumber = useRef(1);
  let totalPageNumber = useRef(3);
  let pages = useRef(null);
  let viewHeight = useRef(document.documentElement.clientHeight);
  let navDotRef = useRef(null);

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
      // updateNav();
      // textFadeInOut();
    }
  };
  const scrollDown = () => {
    if (currentPageNumber.current !== totalPageNumber.current) {
      pages.style.top = -viewHeight.current * currentPageNumber.current + "px";
      currentPageNumber.current++;
      // updateNav();
      // textFadeInOut();
    }
  };
  // 인디케이터 클릭시 이동용
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
  // 인디케이터 업데이트
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

  useEffect(() => {
    pages = document.getElementById("page-list");
    // 초기 페이지 창크기에 맞게 높이 설정
    pages.style.height = viewHeight.current + "px";

    console.log("pages: ", pages);
    const context = {
      currentPageNumber: currentPageNumber.current,
      navDots: navDotRef,
      pages: pages,
      totalPageNumber: totalPageNumber.current,
      viewHeight: viewHeight.current,
    };

    let handleMouseWheel = (e) =>
      helper.throttle(() => mouseScroll(e), 500, context)();
    let handleResize = helper.debounce(resize, 500, context);

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
    <PageList id="page-list">
      {intro.map((item) => (
        <PageItem
          className="page-item"
          onClick={() => localStorage.setItem("color", `${item.first}`)}
        >
          <PageTitle>{item.fullName}</PageTitle>
          <PageDescription>
            저는 프론트엔드 개발자이고, [{item.keywords[0]}]입니다.
          </PageDescription>
        </PageItem>
      ))}
    </PageList>
  );
};

export default Pages;

const PageList = styled.ul`
  position: relative;
  top: 0;
  /* transition으로 부드러운 스크롤 효과 */
  transition: all 800ms ease;
  /* height set by js */
`;
const PageItem = styled.li`
  width: 100%;
  height: 100%;
`;
const PageTitle = styled.h3`
  font-size: 72px;
  margin: 0 0 35px 0;
  /* width: 74.73469388%; */
  width: 61.734694%;
  padding-top: 23px;
  line-height: 1.025em;
  font-weight: 600;
`;
const PageDescription = styled.p`
  font-size: 16px;
  line-height: 24px;
  width: 36.2244898%;
  font-weight: 400;
`;
