import * as fabric from "fabric";

export interface LabelTextboxProps {
  /** 배경 모서리 라운드 반경 */
  bgRadius: number;
  /** 배경색 (없으면 배경 미표시) */
  labelBackgroundColor: string;
}

/**
 * 글자 뒤에 패딩 + 라운드 배경을 그리는 Textbox.
 *
 * - fabric 기본 backgroundColor/textBackgroundColor는 패딩·라운드가 안 되므로
 *   _render에서 직접 둥근 사각형을 그린다.
 * - 여백은 fabric 기본 속성 `padding`을 단일 출처로 사용한다.
 *   (배경 렌더링과 선택 테두리 간격이 같은 값을 공유 → 테두리가 배경을 감쌈)
 * - 단일 텍스트 객체이므로 편집/이동/속성 변경이 그대로 동작하고,
 *   커스텀 속성을 직렬화에 포함해 loadFromJSON 복원도 된다.
 */
export class LabelTextbox extends fabric.Textbox {
  static type = "LabelTextbox";

  declare bgRadius: number;
  declare labelBackgroundColor: string;

  constructor(
    text: string,
    options: Partial<fabric.TextboxProps & LabelTextboxProps> = {},
  ) {
    super(text, options);
    // 필드 초기화가 super 이후 실행되는 함정을 피하려 생성자에서 직접 할당
    this.padding = options.padding ?? 12;
    this.bgRadius = options.bgRadius ?? 8;
    this.labelBackgroundColor =
      options.labelBackgroundColor ?? "rgba(0,0,0,0.6)";
  }

  _render(ctx: CanvasRenderingContext2D) {
    if (this.labelBackgroundColor) {
      // _render는 객체 scale이 적용된 좌표계에서 실행되므로, 화면상 패딩이
      // 균일하도록 scaleX/scaleY로 나눠 보정한다 (비균등 리사이즈 대응).
      const sx = this.scaleX || 1;
      const sy = this.scaleY || 1;
      const px = this.padding / sx;
      const py = this.padding / sy;
      const rx = this.bgRadius / sx;
      const ry = this.bgRadius / sy;

      const x = -this.width / 2 - px;
      const y = -this.height / 2 - py;
      const w = this.width + px * 2;
      const h = this.height + py * 2;

      ctx.save();
      ctx.fillStyle = this.labelBackgroundColor;
      ctx.beginPath();
      // 코너도 화면상 원형 유지를 위해 x/y 반경을 따로 지정
      ctx.roundRect(x, y, w, h, [{ x: rx, y: ry }]);
      ctx.fill();
      ctx.restore();
    }
    super._render(ctx);
  }

  // 커스텀 속성을 직렬화에 포함 (저장/복원용)
  // padding은 fabric 기본 직렬화 대상이라 별도 추가 불필요
  // @ts-expect-error fabric v6의 제네릭 toObject 시그니처와 커스텀 키 추가가 충돌
  toObject(propertiesToInclude: string[] = []) {
    const serialize = super.toObject as unknown as (
      p: string[],
    ) => Record<string, unknown>;
    return serialize.call(this, [
      ...propertiesToInclude,
      "bgRadius",
      "labelBackgroundColor",
    ]);
  }
}

// loadFromJSON 시 type 문자열로 이 클래스를 찾을 수 있게 등록
fabric.classRegistry.setClass(LabelTextbox);
