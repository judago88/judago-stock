import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="이용약관">
      <div className="space-y-10 leading-8 text-sm md:text-base">
        <section>
          <h2 className="text-xl font-semibold mb-4">제1조 목적</h2>

          <p>
            본 약관은 주다고 기준봉 센터가 운영하는 웹사이트에서 제공하는 주식
            관련 교육 콘텐츠, 조건 충족 종목 정보, PDF 전자책 판매 및 관련
            서비스의 이용 조건, 절차, 권리와 의무, 책임사항을 정하는 것을
            목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제2조 용어의 정의</h2>

          <p className="mb-4">
            본 약관에서 사용하는 용어의 뜻은 다음과 같습니다.
          </p>

          <ol className="list-decimal pl-6 space-y-2">
            <li>
              “사이트”란 주다고 기준봉 센터가 운영하는 웹사이트를 말합니다.
            </li>

            <li>
              “이용자”란 회원가입 여부와 관계없이 사이트에 접속하여 서비스를
              이용하는 모든 방문자를 말합니다.
            </li>

            <li>
              “구매자”란 사이트에서 전자책 구매를 신청하고 회사가 안내하는
              방법으로 대금을 지급하는 이용자를 말합니다.
            </li>

            <li>
              “전자책”이란 사이트에서 판매하는 PDF 형식 등의 디지털 콘텐츠를
              말합니다.
            </li>

            <li>
              “콘텐츠”란 사이트에서 제공하는 글, 이미지, PDF, 종목 리스트, 교육
              자료 등 일체의 정보를 말합니다.
            </li>

            <li>
              “조건 충족 종목”이란 사이트가 정한 기준에 따라 분류하거나 기록한
              종목 정보를 말합니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제3조 약관의 게시 및 변경
          </h2>

          <ol className="list-decimal pl-6 space-y-2">
            <li>
              사이트는 이용자가 본 약관의 내용을 쉽게 확인할 수 있도록
              웹사이트에 게시합니다.
            </li>

            <li>
              사이트는 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수
              있습니다.
            </li>

            <li>
              약관이 변경되는 경우 적용일자 및 변경 내용을 웹사이트에
              공지합니다.
            </li>

            <li>변경된 약관은 공지한 적용일자부터 효력이 발생합니다.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제4조 서비스의 내용</h2>

          <p className="mb-4">사이트는 다음 서비스를 제공할 수 있습니다.</p>

          <ol className="list-decimal pl-6 space-y-2">
            <li>주식 관련 교육 콘텐츠 제공</li>
            <li>조건 충족 종목 정보 제공</li>
            <li>PDF 전자책 판매 및 제공</li>
            <li>전자책 구매 신청 및 주문 접수</li>
            <li>무통장입금 확인 및 구매 처리</li>
            <li>전자책 제공 및 구매 관련 안내</li>
            <li>고객 문의 응대</li>
            <li>기타 사이트가 정하는 서비스</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제5조 비회원 구매</h2>

          <ol className="list-decimal pl-6 space-y-2">
            <li>
              사이트는 회원가입 없이 PDF 전자책을 구매할 수 있는 비회원 구매
              방식을 제공할 수 있습니다.
            </li>

            <li>
              전자책 구매 시 이용자는 이름, 이메일 주소, 휴대전화번호 등 주문
              처리에 필요한 정보를 정확하게 입력하여야 합니다.
            </li>

            <li>
              구매자가 주문 시 입력한 이름은 입금 확인을 위한 입금자명으로 함께
              이용될 수 있으며, 실제 입금 시 주문 시 입력한 이름과 동일한
              이름으로 입금하는 것을 원칙으로 합니다.
            </li>

            <li>
              구매자가 입력한 정보가 정확하지 않아 입금 확인 또는 전자책 제공이
              지연되는 경우 사이트는 구매자에게 추가 확인을 요청할 수 있습니다.
            </li>

            <li>
              이메일 주소 등 주문 정보가 잘못 입력되어 전자책 제공이 정상적으로
              이루어지지 않은 경우 사이트는 구매자 본인 및 주문 내역 확인 후
              다시 제공할 수 있습니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제6조 투자 관련 고지</h2>

          <ol className="list-decimal pl-6 space-y-2">
            <li>
              사이트에서 제공하는 모든 주식 관련 정보는 교육 및 참고 목적의
              정보입니다.
            </li>

            <li>
              사이트는 특정 종목의 매수·매도 추천, 투자자문, 투자일임, 수익
              보장을 제공하지 않습니다.
            </li>

            <li>
              조건 충족 종목 정보는 정량 조건 또는 운영자가 정한 기준에 따라
              분류·기록된 참고용 정보이며, 투자 권유를 의미하지 않습니다.
            </li>

            <li>
              전자책에 포함된 예시, 차트, 종목 사례는 학습 목적의 자료이며 향후
              수익을 보장하지 않습니다.
            </li>

            <li>
              모든 투자 판단과 그 결과에 대한 책임은 이용자 본인에게 있습니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제7조 전자책 구매 및 결제
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">1. 전자책 구매</h3>

              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  이용자는 사이트에서 제공하는 구매 절차에 따라 전자책 구매를
                  신청할 수 있습니다.
                </li>

                <li>
                  전자책 구매 시 이용자는 이름, 이메일 주소, 휴대전화번호,
                  입금자명 등 주문 처리에 필요한 정보를 정확하게 입력하여야
                  합니다.
                </li>

                <li>
                  구매자가 입력한 정보가 정확하지 않아 입금 확인 또는 전자책
                  제공이 지연되는 경우 사이트는 구매자에게 추가 확인을 요청할 수
                  있습니다.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-3">2. 결제방법</h3>

              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  사이트에서 판매하는 전자책의 결제는 사이트가 안내하는 계좌로
                  구매자가 직접 입금하는 무통장입금 방식으로 진행됩니다.
                </li>

                <li>
                  구매자는 주문 시 안내된 금액을 지정된 계좌로 입금하여야
                  합니다.
                </li>

                <li>
                  주문자명과 실제 입금자명이 다른 경우 입금 확인이 지연될 수
                  있으며, 이 경우 구매자는 사이트에 실제 입금자명을 알려야
                  합니다.
                </li>

                <li>
                  입금액이 주문금액과 다른 경우 전자책 제공이 보류될 수 있으며,
                  사이트는 구매자와 확인 후 주문 또는 환불 처리를 진행할 수
                  있습니다.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-3">3. 구매계약의 성립</h3>

              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  구매자가 전자책 구매를 신청한 후 사이트가 해당 주문에 대한
                  입금을 확인함으로써 구매 절차가 완료됩니다.
                </li>

                <li>
                  입금이 확인되지 않은 주문은 입금대기 상태로 처리될 수
                  있습니다.
                </li>

                <li>
                  사이트는 입금 확인 후 구매자가 입력한 이메일 또는 사이트에서
                  제공하는 방법을 통하여 구매 완료 사실을 안내할 수 있습니다.
                </li>
              </ol>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제8조 전자책의 제공 및 이용
          </h2>

          <ol className="list-decimal pl-6 space-y-2">
            <li>
              사이트는 구매자의 입금을 확인한 후 전자책을 다운로드하거나 이용할
              수 있도록 제공합니다.
            </li>

            <li>
              전자책은 구매 시 입력한 이메일을 통한 다운로드 링크, 사이트 내
              다운로드 기능 또는 사이트가 별도로 안내하는 방법으로 제공할 수
              있습니다.
            </li>

            <li>
              구매자가 이메일 주소 등 주문 정보를 잘못 입력하여 전자책을
              정상적으로 제공받지 못한 경우 사이트는 본인 및 주문 확인 후 다시
              제공할 수 있습니다.
            </li>

            <li>
              시스템 장애 등으로 전자책 제공이 정상적으로 이루어지지 않은 경우
              사이트는 확인 후 다시 다운로드하거나 이용할 수 있도록 조치할 수
              있습니다.
            </li>

            <li>
              구매자는 전자책을 본인의 개인 학습 목적으로만 이용할 수 있습니다.
            </li>

            <li>
              구매자는 전자책 파일을 제3자에게 공유, 배포, 판매, 재판매, 무단
              전송 또는 무단 업로드할 수 없습니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제9조 이용자의 의무</h2>

          <p className="mb-4">이용자는 다음 행위를 해서는 안 됩니다.</p>

          <ol className="list-decimal pl-6 space-y-2">
            <li>타인의 개인정보를 도용하는 행위</li>

            <li>허위 정보를 입력하여 구매 또는 문의하는 행위</li>

            <li>전자책 PDF 파일을 무단 복제, 공유, 배포, 판매하는 행위</li>

            <li>
              사이트 콘텐츠를 무단으로 복사, 캡처, 저장, 배포, 2차 가공하는 행위
            </li>

            <li>사이트 운영을 방해하는 행위</li>

            <li>
              사이트 콘텐츠를 이용하여 유료 리딩, 종목 추천, 불법 영업을 하는
              행위
            </li>

            <li>관련 법령 또는 본 약관을 위반하는 행위</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제10조 주문의 취소 및 환불
          </h2>

          <ol className="list-decimal pl-6 space-y-2">
            <li>
              구매자의 주문 취소 및 환불에 관한 사항은 사이트에 게시된 환불정책
              및 관련 법령에 따릅니다.
            </li>

            <li>
              전자책 제공이 시작되기 전 구매자가 주문 취소를 요청하는 경우
              사이트는 입금 여부를 확인한 후 환불 절차를 진행합니다.
            </li>

            <li>
              디지털콘텐츠의 특성상 전자책 제공이 시작된 이후에는 관련 법령에
              따라 청약철회가 제한될 수 있습니다.
            </li>

            <li>
              다만, 제공된 전자책이 표시·광고된 내용과 다르거나 계약 내용과
              다르게 제공된 경우에는 관련 법령에 따른 구매자의 권리가
              보장됩니다.
            </li>
          </ol>

          <p className="mt-4">
            전자책 환불에 관한 보다 구체적인 기준과 절차는 별도의 환불정책에
            따릅니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제11조 콘텐츠의 저작권</h2>

          <ol className="list-decimal pl-6 space-y-2">
            <li>
              사이트에서 제공하는 모든 콘텐츠의 저작권은 사이트 또는 정당한
              권리자에게 있습니다.
            </li>

            <li>
              이용자는 사이트의 사전 동의 없이 콘텐츠를 복제, 배포, 전송, 판매,
              출판, 2차 가공할 수 없습니다.
            </li>

            <li>
              전자책 PDF 파일은 구매자 본인의 개인 학습 용도로만 사용할 수
              있습니다.
            </li>

            <li>
              무단 공유, 무단 배포, 재판매가 확인될 경우 사이트는 이용 제한,
              손해배상 청구 등 필요한 조치를 취할 수 있습니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제12조 서비스의 변경 및 중단
          </h2>

          <ol className="list-decimal pl-6 space-y-2">
            <li>
              사이트는 운영상 또는 기술상 필요에 따라 서비스의 일부 또는 전부를
              변경할 수 있습니다.
            </li>

            <li>
              시스템 점검, 장애, 보안 문제, 서버 또는 외부 서비스 장애 등으로
              서비스가 일시 중단될 수 있습니다.
            </li>

            <li>
              시스템 장애 등으로 전자책 제공이 정상적으로 이루어지지 않은 경우
              사이트는 사실관계를 확인한 후 전자책을 다시 제공하거나 필요한
              조치를 할 수 있습니다.
            </li>

            <li>
              서비스 변경 또는 중단이 예정된 경우 사이트는 가능한 범위에서
              사전에 공지합니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제13조 책임의 제한</h2>

          <ol className="list-decimal pl-6 space-y-2">
            <li>사이트는 이용자의 투자 결과에 대해 책임지지 않습니다.</li>

            <li>
              사이트에서 제공하는 정보는 교육 및 참고 목적의 정보이며, 투자
              수익을 보장하지 않습니다.
            </li>

            <li>
              이용자가 사이트의 정보를 바탕으로 투자 결정을 한 경우 그 책임은
              이용자 본인에게 있습니다.
            </li>

            <li>
              사이트는 천재지변, 시스템 장애, 서버 또는 외부 서비스 장애 등
              합리적으로 통제하기 어려운 사유로 발생한 손해에 대해 관련 법령이
              허용하는 범위에서 책임이 제한될 수 있습니다.
            </li>

            <li>
              이용자가 본 약관을 위반하여 발생한 손해는 해당 이용자가 책임을
              부담합니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제14조 개인정보 보호</h2>

          <p>
            사이트는 이용자의 개인정보를 관련 법령에 따라 보호하며, 개인정보
            처리에 관한 구체적인 사항은 별도의 개인정보처리방침에 따릅니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제15조 분쟁 해결</h2>

          <ol className="list-decimal pl-6 space-y-2">
            <li>
              사이트와 이용자 간 분쟁이 발생한 경우 양 당사자는 원만한 해결을
              위해 성실히 협의합니다.
            </li>

            <li>
              협의가 이루어지지 않을 경우 관련 법령에 따른 관할 법원 또는
              분쟁조정기관의 절차에 따릅니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제16조 사업자 정보</h2>

          <div className="rounded-lg border border-border p-5 bg-muted/20 space-y-2">
            <p>
              <strong>상호명</strong> : 주다고(Judago)
            </p>

            <p>
              <strong>대표자</strong> : 윤보석
            </p>

            <p>
              <strong>사업자등록번호</strong> : 257-07-03387
            </p>

            <p>
              <strong>통신판매업신고번호</strong> : 2026-인천연수구-1205
            </p>

            <p>
              <strong>주소</strong> : 인천 부평구 대정로 66, 4층 408-117호
              (부평동, 다운타운일레븐)
            </p>

            <p>
              <strong>이메일</strong> : judago@naver.com
            </p>

            <p>
              <strong>연락처</strong> : 010-5007-1723
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">부칙</h2>

          <p className="font-medium">
            본 약관은 2026년 06월 01일부터 시행합니다.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
