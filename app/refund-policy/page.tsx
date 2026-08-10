import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout title="환불정책">
      <div className="space-y-10 leading-8 text-sm md:text-base">
        <p>
          주다고 기준봉 센터에서 판매하는 상품은 PDF 형태로 제공되는
          디지털콘텐츠입니다.
        </p>

        <p>
          본 환불정책은 구매 취소, 청약철회 및 환불에 관한 기준을 안내하기 위한
          것이며 「전자상거래 등에서의 소비자보호에 관한 법률」 등 관계 법령에
          따라 적용됩니다.
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
            제2조 입금 전 주문 취소
          </h2>

          <p>
            구매 신청 후 24시간 이내에 대금을 입금하지 않은 경우 별도의 환불
            절차 없이 자동으로 주문이 취소될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제3조 입금 후 전자책 제공 전 취소
          </h2>

          <p className="mb-4">
            구매자가 대금을 입금하였으나 아직 전자책이 제공되지 않은 경우,
            구매자는 주문 취소 및 환불을 요청할 수 있습니다.
          </p>

          <p>
            사이트는 구매자의 주문 및 실제 입금 내역을 확인한 후 환불 가능
            여부를 검토하고, 환불이 가능한 경우 환불 절차를 진행합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제4조 전자책 제공 이후의 환불
          </h2>

          <p className="mb-4">
            전자책이 정상적으로 제공되고 디지털콘텐츠의 제공 또는 이용이 개시된
            이후에는 관계 법령상 청약철회 제한 요건에 해당하는 경우 단순 변심에
            따른 환불이 제한될 수 있습니다.
          </p>

          <p className="mb-4">
            다음과 같은 사유만으로 관계 법령상 청약철회 제한 요건이 충족된
            이후의 환불을 요구하는 경우에는 환불이 제한될 수 있습니다.
          </p>

          <ol className="list-decimal pl-6 space-y-2">
            <li>구매 후 마음이 바뀐 경우</li>

            <li>구매자의 기대와 내용이 다르다는 주관적인 사유</li>

            <li>구매자가 자신의 판단으로 잘못 구매한 경우</li>

            <li>이미 제공된 내용을 충분히 활용하지 않았다는 사유</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제5조 전자책에 문제가 있는 경우
          </h2>

          <p className="mb-4">
            다음 각 호에 해당하는 경우에는 전자책 제공 이후라도 관련 법령 및
            사실관계 확인에 따라 재제공, 교환 또는 환불 등의 조치를 받을 수
            있습니다.
          </p>

          <ol className="list-decimal pl-6 space-y-2">
            <li>구매한 전자책과 다른 파일이 제공된 경우</li>

            <li>전자책 파일이 손상되어 정상적으로 이용할 수 없는 경우</li>

            <li>
              표시 또는 광고한 내용과 실제 제공된 전자책의 내용이 다른 경우
            </li>

            <li>
              기타 사이트의 귀책사유로 정상적인 전자책 이용이 불가능한 경우
            </li>
          </ol>

          <p className="mt-4">
            단순한 이메일 수신 오류, 파일 전달 오류 등 재전송으로 해결할 수 있는
            문제의 경우에는 환불보다 정상적인 파일의 재제공을 우선하여 처리할 수
            있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제6조 환불 요청 방법</h2>

          <p className="mb-4">
            환불을 원하는 구매자는 사이트에 안내된 고객문의 방법을 통하여 환불을
            신청할 수 있습니다.
          </p>

          <div className="rounded-lg border border-border p-4 bg-muted/20 mb-4">
            <p>
              <strong>이메일:</strong> judago@naver.com
            </p>
          </div>

          <p className="mb-4">환불 요청 시 아래 정보를 전달하여야 합니다.</p>

          <ol className="list-decimal pl-6 space-y-2">
            <li>구매자명</li>

            <li>주문 시 사용한 이메일 주소 또는 연락처</li>

            <li>입금자명</li>

            <li>구매한 전자책</li>

            <li>환불 사유</li>

            <li>환불받을 은행명</li>

            <li>계좌번호</li>

            <li>예금주명</li>
          </ol>

          <p className="mt-4">
            사이트는 구매 및 입금내역을 확인한 후 환불 가능 여부를 안내합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제7조 환불 방법</h2>

          <p className="mb-4">
            무통장입금으로 결제된 주문의 환불은 원칙적으로 구매자가 제공한 본인
            명의의 환불계좌로 계좌이체하는 방식으로 진행됩니다.
          </p>

          <p className="mb-4">
            구매자명, 입금자명 또는 환불계좌의 예금주가 서로 다른 경우 본인 확인
            또는 거래 확인을 위하여 추가 정보를 요청할 수 있습니다.
          </p>

          <p>
            잘못된 계좌정보를 제공하여 환불이 지연되거나 잘못 송금되는 것을
            방지하기 위해 구매자는 정확한 환불계좌 정보를 제공하여야 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제8조 중복입금 및 금액 오입금
          </h2>

          <p className="mb-4">
            구매자가 동일 주문에 대해 중복으로 입금하거나 주문금액과 다른 금액을
            입금한 경우 사이트는 실제 입금내역과 주문정보를 확인한 후
            처리합니다.
          </p>

          <p className="mb-4">
            초과 입금액 또는 환불이 필요한 금액이 확인되는 경우 구매자와
            사실관계를 확인한 후 계좌이체 등의 방식으로 환불할 수 있습니다.
          </p>

          <p>
            주문금액보다 적게 입금한 경우 부족한 금액이 확인될 때까지 전자책
            제공이 보류될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제9조 이메일 오기재 및 재발송
          </h2>

          <p className="mb-4">
            구매자가 주문 시 이메일 주소를 잘못 입력하여 전자책을 정상적으로
            받지 못한 경우 사이트는 구매자 본인 및 주문 내역을 확인한 후
            전자책을 다시 제공할 수 있습니다.
          </p>

          <p>
            단순한 이메일 오기재, 수신 오류 또는 재전송으로 해결 가능한 문제는
            원칙적으로 환불 사유가 되지 않으며, 정상적인 전자책 재제공을
            우선하여 처리할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제10조 구매 전 확인 사항
          </h2>

          <p className="mb-4">
            구매자는 구매 전에 다음 내용을 확인하여 주시기 바랍니다.
          </p>

          <ol className="list-decimal pl-6 space-y-2">
            <li>본 상품은 PDF 형식으로 제공되는 디지털콘텐츠입니다.</li>

            <li>결제는 무통장입금 방식으로 진행됩니다.</li>

            <li>
              입금 확인 후 구매 시 입력한 이메일 주소로 전자책이 제공됩니다.
            </li>

            <li>입금 확인 후 1영업일 이내 PDF 파일을 발송합니다.</li>

            <li>
              전자책의 제공 또는 이용이 개시된 이후에는 관계 법령에서 정한
              요건에 따라 단순 변심에 의한 청약철회가 제한될 수 있습니다.
            </li>

            <li>
              본 전자책은 주식 교육 및 학습을 위한 콘텐츠이며 특정 종목의
              매수·매도를 추천하거나 투자수익을 보장하는 상품이 아닙니다.
            </li>

            <li>
              구매한 전자책은 구매자 본인의 개인적인 학습목적으로 사용할 수
              있습니다.
            </li>

            <li>
              전자책을 무단 복제·공유·배포·판매 또는 재판매하는 행위는
              금지됩니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제11조 관련 법령의 적용
          </h2>

          <p>
            본 환불정책에서 정하지 않은 사항은 「전자상거래 등에서의
            소비자보호에 관한 법률」 등 관련 법령에 따릅니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제12조 시행일</h2>

          <p className="font-medium">
            본 환불정책은 2026년 06월 01일부터 시행합니다.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
