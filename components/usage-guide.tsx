export function StockUsageGuide() {
  return (
    <section className="mt-12 px-6 text-md text-muted-foreground">
      <div className="space-y-4 leading-7">
        <div className="space-y-2">
          <p>
            해당 웹사이트는{" "}
            <span className="text-foreground font-medium">'기준봉'</span>이
            출현한 주식 종목들이 매일 자동으로 업데이트됩니다.
          </p>

          <p>
            세력추종매매 중 하나인{" "}
            <span className="text-foreground font-medium">'기준봉매매법'</span>
            으로 경제적 자유를 누려보시기 바랍니다.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <h2 className="text-base font-semibold text-foreground">
            주다고 기준봉센터 이용방법
          </h2>

          <ol className="list-decimal space-y-1 pl-5">
            <li>날짜별로 추출되는 종목들을 내 관심종목에 넣는다.</li>
            <li>본인만의 매수, 매도 타점을 잡고 수익을 실현한다.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
