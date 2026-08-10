import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="개인정보처리방침">
      <div className="space-y-10 leading-8 text-sm md:text-base">
        <p>
          주다고 기준봉 센터는 이용자의 개인정보를 중요하게 생각하며, 「개인정보
          보호법」 등 관련 법령을 준수하기 위하여 다음과 같이 개인정보처리방침을
          공개합니다.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제1조 개인정보의 처리 목적
          </h2>

          <p className="mb-4">
            주다고 기준봉 센터는 회원가입 없이 누구나 이용할 수 있는
            웹사이트입니다. 다만 PDF 전자책 구매 신청, 무통장입금 확인, 전자책
            제공, 현금영수증 처리, 환불 및 고객 문의 응대 등을 위하여 필요한
            범위에서 개인정보를 처리할 수 있습니다.
          </p>

          <p className="mb-3">개인정보는 다음의 목적으로 이용됩니다.</p>

          <div className="space-y-4">
            <div>
              <strong>1. PDF 전자책 구매 신청 및 주문 확인</strong>

              <ul className="list-disc pl-6 mt-2">
                <li>전자책 구매 신청 접수</li>
                <li>구매자 및 주문자 확인</li>
                <li>주문 상품 및 주문 금액 확인</li>
                <li>주문 상태 및 구매 내역 관리</li>
              </ul>
            </div>

            <div>
              <strong>2. 무통장입금 확인</strong>

              <ul className="list-disc pl-6 mt-2">
                <li>무통장입금 여부 확인</li>
                <li>구매자와 실제 입금자 확인</li>
                <li>입금 금액 및 입금 일시 확인</li>
                <li>미입금, 오입금 등 주문 관련 사실관계 확인</li>
              </ul>
            </div>

            <div>
              <strong>3. 전자책 제공 및 구매 관련 안내</strong>

              <ul className="list-disc pl-6 mt-2">
                <li>구매 완료 및 주문 처리 안내</li>
                <li>구매자가 입력한 이메일 주소로 PDF 전자책 제공</li>
                <li>전자책 발송 오류 또는 수신 오류 확인 및 재제공</li>
              </ul>
            </div>

            <div>
              <strong>4. 현금영수증 발급 및 세무 처리</strong>

              <ul className="list-disc pl-6 mt-2">
                <li>현금영수증 신청 여부 확인</li>
                <li>소득공제용 현금영수증 발급</li>
                <li>현금영수증 자진발급 등 관련 세무 처리</li>
              </ul>
            </div>

            <div>
              <strong>5. 환불 처리</strong>

              <ul className="list-disc pl-6 mt-2">
                <li>환불 요청자 및 주문 내역 확인</li>
                <li>환불 가능 여부 확인</li>
                <li>환불 계좌 확인 및 환불금 지급</li>
                <li>환불 및 취소 내역 관리</li>
              </ul>
            </div>

            <div>
              <strong>6. 고객 문의 응대</strong>

              <ul className="list-disc pl-6 mt-2">
                <li>문의자 확인</li>
                <li>문의 내용 확인</li>
                <li>답변 및 구매 관련 안내</li>
                <li>분쟁 또는 민원 처리</li>
              </ul>
            </div>

            <div>
              <strong>7. 서비스 운영 및 보안</strong>

              <ul className="list-disc pl-6 mt-2">
                <li>비정상 이용 방지</li>
                <li>서비스 이용 기록 확인</li>
                <li>서비스 오류 분석</li>
                <li>주문 및 처리 기록 관리</li>
                <li>분쟁 발생 시 사실관계 확인</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제2조 처리하는 개인정보 항목
          </h2>

          <p className="mb-4">
            주다고 기준봉 센터는 전자책 구매 및 제공을 위하여 다음과 같은
            개인정보를 처리할 수 있습니다.
          </p>

          <div className="space-y-4">
            <div>
              <strong>1. 전자책 구매 시</strong>

              <ul className="list-disc pl-6 mt-2">
                <li>구매자 이름</li>
                <li>이메일 주소</li>
                <li>휴대전화번호</li>
                <li>입금자명</li>
                <li>주문 상품</li>
                <li>주문 금액</li>
                <li>주문 상태</li>
                <li>입금 확인 상태</li>
                <li>현금영수증 신청 여부</li>
                <li>구매자가 직접 입력한 주문 관련 문의사항</li>
              </ul>

              <p className="mt-3 text-muted-foreground">
                ※ 현재 주문 과정에서 입력한 구매자 이름은 입금 확인을 위한
                입금자명으로 함께 이용될 수 있습니다.
              </p>
            </div>

            <div>
              <strong>2. 무통장입금 확인 시</strong>

              <ul className="list-disc pl-6 mt-2">
                <li>입금자명</li>
                <li>입금금액</li>
                <li>입금일시</li>
                <li>입금 여부 및 관련 거래내역</li>
              </ul>

              <p className="mt-3 text-muted-foreground">
                무통장입금 확인을 위하여 운영자가 금융기관에서 제공하는 거래내역
                중 주문 확인에 필요한 정보를 확인할 수 있습니다.
              </p>
            </div>

            <div>
              <strong>3. 환불 처리 시</strong>

              <ul className="list-disc pl-6 mt-2">
                <li>은행명</li>
                <li>계좌번호</li>
                <li>예금주명</li>
                <li>환불 대상 주문 및 입금 내역</li>
              </ul>

              <p className="mt-3 text-muted-foreground">
                환불을 위해 추가로 수집한 계좌정보는 환불 처리 목적에 한하여
                이용합니다.
              </p>
            </div>

            <div>
              <strong>4. 고객 문의 시</strong>

              <ul className="list-disc pl-6 mt-2">
                <li>이름 또는 닉네임</li>
                <li>이메일 주소</li>
                <li>연락처</li>
                <li>문의 내용</li>
                <li>
                  답변 또는 사실관계 확인을 위해 이용자가 직접 제공한 정보
                </li>
              </ul>
            </div>

            <div>
              <strong>
                5. 서비스 이용 과정에서 자동으로 생성될 수 있는 정보
              </strong>

              <ul className="list-disc pl-6 mt-2">
                <li>접속 IP</li>
                <li>접속 일시</li>
                <li>브라우저 정보</li>
                <li>기기 정보</li>
                <li>쿠키</li>
                <li>서비스 이용 기록</li>
                <li>주문 처리 기록</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-border p-4 bg-muted/20">
            <p>
              ※ 주다고 기준봉 센터는 구매자의 인터넷뱅킹 비밀번호, 보안카드
              정보, OTP 번호 등 금융기관의 인증정보를 수집하거나 저장하지
              않습니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제3조 결제정보의 처리</h2>

          <p className="mb-4">
            주다고 기준봉 센터의 전자책 결제는 운영자가 안내하는 계좌로 구매자가
            직접 입금하는 무통장입금 방식으로 진행됩니다.
          </p>

          <p className="mb-4">
            주다고 기준봉 센터는 구매자의 인터넷뱅킹 비밀번호, 보안카드 정보,
            OTP 번호 등 금융기관의 인증정보를 직접 수집하거나 저장하지 않습니다.
          </p>

          <p>
            입금 여부 확인을 위하여 운영자가 금융기관에서 제공하는 거래내역 중
            입금자명, 입금금액 및 입금일시 등의 정보를 확인할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제4조 환불계좌 정보의 처리
          </h2>

          <p className="mb-4">
            전자책 주문의 환불이 필요한 경우 환불 처리를 위하여 구매자로부터
            은행명, 계좌번호 및 예금주명을 추가로 제공받을 수 있습니다.
          </p>

          <p>
            해당 정보는 환불 처리 및 관련 분쟁 대응을 위한 목적으로만 이용하며,
            관련 법령에 따라 보관할 필요가 있는 경우를 제외하고 이용 목적 달성
            후 안전하게 파기합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제5조 개인정보의 처리 및 보유 기간
          </h2>

          <p className="mb-4">
            주다고 기준봉 센터는 개인정보의 수집 및 이용 목적이 달성된 후에는
            해당 정보를 지체 없이 파기합니다. 다만 관련 법령에 따라 일정 기간
            보존하여야 하는 경우에는 해당 기간 동안 안전하게 보관할 수 있습니다.
          </p>

          <p className="mb-4">
            「전자상거래 등에서의 소비자보호에 관한 법률」 및 같은 법 시행령에
            따른 주요 보존기간은 다음과 같습니다.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>표시·광고에 관한 기록: 6개월</li>
            <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
            <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
            <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
          </ul>

          <p className="mt-4">
            현금영수증, 세금 및 회계 관련 기록은 관련 세법 등 관계 법령에서 정한
            기간 동안 보관할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제6조 개인정보의 제3자 제공
          </h2>

          <p className="mb-4">
            주다고 기준봉 센터는 이용자의 개인정보를 원칙적으로 외부에 제공하지
            않습니다.
          </p>

          <p className="mb-3">
            다만 다음의 경우에는 예외적으로 제공될 수 있습니다.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>이용자가 사전에 동의한 경우</li>

            <li>법령에 따라 제출 의무가 있는 경우</li>

            <li>
              수사기관, 법원, 감독기관 등 법령상 권한 있는 기관의 적법한 요청이
              있는 경우
            </li>

            <li>
              현금영수증 발급 및 세무 관련 법적 의무를 이행하기 위하여 국세청 등
              관계기관에 필요한 정보를 제출하는 경우
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제7조 개인정보 처리업무의 위탁
          </h2>

          <p className="mb-4">
            주다고 기준봉 센터는 원활한 웹사이트 및 전자책 판매 서비스 운영을
            위하여 필요한 범위에서 개인정보 처리업무를 외부 서비스에 위탁할 수
            있습니다.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              웹사이트 호스팅 및 배포 서비스: 웹사이트 운영, 서버 관리 및 배포
            </li>

            <li>
              데이터베이스 또는 백엔드 서비스: 주문 정보, 구매자 정보, 주문 처리
              상태 및 문의 내역 저장·관리
            </li>

            <li>
              이메일 서비스: 전자책 제공, 구매 관련 안내 및 고객 문의 응대
            </li>
          </ul>

          <p className="mt-4">
            주다고 기준봉 센터는 개인정보 처리업무를 위탁하는 경우 관련 법령에
            따라 개인정보가 안전하게 처리될 수 있도록 필요한 사항을 관리합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제8조 개인정보의 파기 절차 및 방법
          </h2>

          <p className="mb-4">
            주다고 기준봉 센터는 개인정보 보유기간의 경과 또는 처리 목적 달성 등
            개인정보가 불필요하게 되었을 때에는 해당 개인정보를 안전하게
            파기합니다.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              전자적 파일 형태의 개인정보: 복구 및 재생이 불가능한 방법으로 삭제
            </li>

            <li>종이 문서 형태의 개인정보: 분쇄 또는 소각</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제9조 이용자의 권리</h2>

          <p className="mb-4">
            이용자는 관련 법령에서 정하는 범위에서 언제든지 자신의 개인정보에
            대해 다음과 같은 권리를 행사할 수 있습니다.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>개인정보 열람 요청</li>
            <li>개인정보 정정 요청</li>
            <li>개인정보 삭제 요청</li>
            <li>개인정보 처리정지 요청</li>
          </ul>

          <p className="mt-4">
            개인정보 관련 요청은 아래 이메일을 통해 접수할 수 있습니다.
          </p>

          <p className="mt-2 font-medium">이메일: judago@naver.com</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제10조 쿠키의 사용</h2>

          <p>
            주다고 기준봉 센터는 서비스 이용 편의, 접속 기록 확인, 서비스 오류
            분석 등을 위하여 쿠키를 사용할 수 있습니다.
          </p>

          <p className="mt-4">
            이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수
            있습니다. 다만 쿠키 저장을 거부할 경우 일부 기능 이용에 제한이 있을
            수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제11조 개인정보 보호책임자
          </h2>

          <ul className="space-y-2">
            <li>개인정보 보호책임자: 윤보석</li>
            <li>이메일: judago@naver.com</li>
            <li>연락처: 010-8238-4511</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제12조 개인정보처리방침의 변경
          </h2>

          <p>
            본 개인정보처리방침은 관련 법령, 서비스 내용 및 운영 방침의 변경에
            따라 수정될 수 있습니다.
          </p>

          <p className="mt-4">
            개인정보처리방침이 변경되는 경우 웹사이트 공지사항 또는 별도의 안내
            페이지를 통하여 변경 내용을 안내할 수 있습니다.
          </p>

          <p className="mt-6 font-medium">시행일자: 2026년 06월 01일</p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
