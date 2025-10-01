import React from "react" //React 불러옴
import { navigate } from "../lib/history" //navigate 함수 불러옴

//Props 타입 정의
type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string
  replace?: boolean
} //원래 <a> 태그가 가질 수 있는 모든 속성(href, className, target, …)을 상속.
//추가로 to(이동할 경로)와 replace(히스토리를 덮어쓸지 여부)라는 커스텀 속성을 정의.

//Link 컴포넌트 본문
export default function Link({ to, replace, onClick, ...rest }: Props) {
  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault()          // 기본 동작(전체 리로드) 막기
        onClick?.(e)                //외부에서 전달된 onClick 있으면 실행
        navigate(to, !!replace)     //SPA방식으로 URL 변경
      }}
      {...rest}                     //나머지 속성(className 등) 전달
    />
  )
}
