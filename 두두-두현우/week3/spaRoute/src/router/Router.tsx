import {
  Children,
  cloneElement,
  useMemo,
  type ReactElement,
  type FC,
} from "react";
import type { RoutesProps, RouteProps } from "../types/types";
import { useCurrentPath } from "../hooks/hooks";

// 라우트 엘리먼트인지 확인하는 헬퍼 함수
const isRouteElement = (
  element: unknown
): element is ReactElement<RouteProps> => {
  return !!(
    element &&
    typeof element === "object" &&
    element !== null &&
    "props" in element &&
    element.props &&
    typeof element.props === "object" &&
    element.props !== null &&
    "path" in element.props
  );
};

// Router.tsx
export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();
  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    return routes.find((route) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return null;
  return cloneElement(activeRoute as ReactElement);
};
