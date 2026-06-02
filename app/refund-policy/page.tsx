import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout title="환불정책">
      <div className="space-y-10 leading-8 text-sm md:text-base">
        <p>
          주다고 기준봉 센터는 PDF 전자책을 판매하는 디지털 콘텐츠 서비스입니다.
          본 환불정책은 전자책 구매, 다운로드, 청약철회 및 환불 기준을 안내하기
          위한 것입니다.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제1조 환불정책의 적용 대상
          </h2>

          <p>
            본 환불정책은 주다고 기준봉 센터에서 판매하는 PDF 전자책 구매 건에
            적용됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제2조 청약철회 가능 기간
          </h2>

          <p className="mb-4">
            구매자는 결제일로부터 7일 이내에 청약철회 또는 환불을 요청할 수
            있습니다.
          </p>

          <p>
            다만 PDF 전자책은 다운로드 또는 열람이 가능한 디지털 콘텐츠이므로,
            아래의 경우에는 청약철회 및 환불이 제한될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제3조 환불이 제한되는 경우
          </h2>

          <p className="mb-4">
            다음 각 호에 해당하는 경우 단순 변심에 의한 환불이 제한될 수
            있습니다.
          </p>

          <ol className="list-decimal pl-6 space-y-2">
            <li>구매자가 PDF 전자책을 다운로드한 경우</li>
            <li>
              구매자에게 전자책 파일 또는 다운로드 링크가 정상적으로 제공된 경우
            </li>
            <li>구매자가 전자책 열람을 시작한 경우</li>
            <li>구매자가 결제 전 “다운로드 시작 후 환불 제한”에 동의한 경우</li>
            <li>구매자의 단순 변심, 착오 구매, 기대와 다름 등의 사유인 경우</li>
            <li>
              전자책 파일이 구매자에게 정상 제공된 이후 복제가 가능한 상태가 된
              경우
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제4조 환불이 가능한 경우
          </h2>

          <p className="mb-4">
            다음 각 호에 해당하는 경우 환불 또는 재제공이 가능합니다.
          </p>

          <ol className="list-decimal pl-6 space-y-2">
            <li>결제는 완료되었으나 전자책이 제공되지 않은 경우</li>
            <li>
              다운로드 링크가 작동하지 않고 사이트가 이를 해결하지 못한 경우
            </li>
            <li>구매한 상품과 다른 파일이 제공된 경우</li>
            <li>전자책 파일이 손상되어 정상적으로 열람할 수 없는 경우</li>
            <li>사이트의 중복 결제 오류가 확인된 경우</li>
            <li>표시·광고된 내용과 실제 제공된 콘텐츠가 명백히 다른 경우</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제5조 환불 요청 방법</h2>

          <p className="mb-4">환불 요청은 아래 이메일로 접수할 수 있습니다.</p>

          <div className="rounded-lg border border-border p-4 bg-muted/20 mb-4">
            <p>
              <strong>이메일:</strong> judago@naver.com
            </p>
          </div>

          <p className="mb-4">환불 요청 시 아래 정보를 함께 보내야 합니다.</p>

          <ol className="list-decimal pl-6 space-y-2">
            <li>구매자명</li>
            <li>구매 시 입력한 이메일 주소</li>
            <li>결제 일시</li>
            <li>구매 상품명</li>
            <li>결제 금액</li>
            <li>환불 요청 사유</li>
            <li>결제 내역 확인 자료</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제6조 환불 처리 절차</h2>

          <ol className="list-decimal pl-6 space-y-2">
            <li>
              사이트는 환불 요청 접수 후 결제 내역과 다운로드 제공 여부를
              확인합니다.
            </li>
            <li>환불 가능 여부를 검토한 후 이메일로 처리 결과를 안내합니다.</li>
            <li>
              환불이 승인된 경우 결제수단 또는 결제대행사의 정책에 따라 환불이
              진행됩니다.
            </li>
            <li>
              카드사, 은행, 결제대행사의 처리 일정에 따라 실제 환불 완료 시점은
              달라질 수 있습니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제7조 다운로드 오류 처리
          </h2>

          <p className="mb-4">
            구매자가 결제 완료 후 전자책을 다운로드하지 못한 경우, 사이트는
            환불보다 정상 제공을 우선으로 처리할 수 있습니다.
          </p>

          <p className="mb-4">
            다음과 같은 경우에는 재발송 또는 재다운로드 링크를 제공할 수
            있습니다.
          </p>

          <ol className="list-decimal pl-6 space-y-2">
            <li>이메일 주소 입력 오류</li>
            <li>다운로드 링크 만료</li>
            <li>일시적인 시스템 오류</li>
            <li>스팸함 수신으로 인한 미확인</li>
            <li>기기 또는 브라우저 문제로 인한 다운로드 실패</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제8조 구매 전 확인 사항
          </h2>

          <ol className="list-decimal pl-6 space-y-2">
            <li>본 상품은 PDF 형식의 디지털 콘텐츠입니다.</li>
            <li>
              다운로드 또는 열람이 시작된 이후에는 단순 변심에 의한 환불이
              제한될 수 있습니다.
            </li>
            <li>
              본 전자책은 주식 교육용 콘텐츠이며, 특정 종목의 매수·매도 추천이나
              수익 보장을 의미하지 않습니다.
            </li>
            <li>
              전자책은 구매자 본인의 개인 학습 목적으로만 사용할 수 있습니다.
            </li>
            <li>전자책 파일의 무단 복제, 공유, 배포, 판매는 금지됩니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제9조 시행일</h2>

          <p className="font-medium">
            본 환불정책은 2026년 06월 01일부터 시행합니다.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
