import { Children, cloneElement, useMemo, type ReactElement } from "react";

// Router.tsx
export const Routes: FC<RoutesProp> = ({ children }) => {
  const currentPath = useCurrentPat();
  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    return routes.find((route) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return null;
  return cloneElement(activeRoute as ReactElement);
};
