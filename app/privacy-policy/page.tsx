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
            웹사이트입니다. 다만 PDF 전자책 구매, 결제 확인, 다운로드 제공, 고객
            문의 응대 등을 위해 필요한 범위에서 개인정보를 처리합니다.
          </p>

          <p className="mb-3">개인정보는 다음 목적을 위해 처리됩니다.</p>

          <div className="space-y-4">
            <div>
              <strong>1. PDF 전자책 구매 및 결제 처리</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>구매자 확인</li>
                <li>결제 승인 여부 확인</li>
                <li>결제 취소 및 환불 처리</li>
                <li>구매 내역 확인</li>
              </ul>
            </div>

            <div>
              <strong>2. 전자책 제공</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>PDF 전자책 다운로드 제공</li>
                <li>다운로드 링크 또는 구매 확인 안내</li>
                <li>구매 오류 및 다운로드 오류 처리</li>
              </ul>
            </div>

            <div>
              <strong>3. 고객 문의 응대</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>문의자 확인</li>
                <li>문의 내용 확인</li>
                <li>답변 발송</li>
                <li>분쟁 또는 민원 처리</li>
              </ul>
            </div>

            <div>
              <strong>4. 서비스 운영 및 보안</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>비정상 이용 방지</li>
                <li>접속 기록 확인</li>
                <li>서비스 오류 분석</li>
                <li>결제 및 다운로드 기록 관리</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제2조 처리하는 개인정보 항목
          </h2>

          <p className="mb-4">
            주다고 기준봉 센터는 서비스 제공을 위해 다음 개인정보를 처리할 수
            있습니다.
          </p>

          <div className="space-y-4">
            <div>
              <strong>1. 전자책 구매 시</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>이름 또는 구매자명</li>
                <li>이메일 주소</li>
                <li>휴대전화번호</li>
                <li>결제 금액</li>
                <li>구매 상품명</li>
                <li>결제 승인번호</li>
                <li>결제 일시</li>
                <li>결제 상태</li>
                <li>다운로드 제공 여부</li>
              </ul>
            </div>

            <div>
              <strong>2. 고객 문의 시</strong>
              <ul className="list-disc pl-6 mt-2">
                <li>이름 또는 닉네임</li>
                <li>이메일 주소</li>
                <li>문의 내용</li>
                <li>답변을 위해 이용자가 직접 입력한 정보</li>
              </ul>
            </div>

            <div>
              <strong>
                3. 서비스 이용 과정에서 자동으로 생성될 수 있는 정보
              </strong>
              <ul className="list-disc pl-6 mt-2">
                <li>접속 IP</li>
                <li>접속 일시</li>
                <li>브라우저 정보</li>
                <li>기기 정보</li>
                <li>쿠키</li>
                <li>서비스 이용 기록</li>
                <li>결제 및 다운로드 로그</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-border p-4 bg-muted/20">
            <p>
              ※ 카드번호, 계좌번호 등 결제수단의 전체 정보는
              결제대행사(PG사)에서 처리하며, 주다고 기준봉 센터는 이를 직접
              저장하지 않습니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제3조 개인정보의 처리 및 보유 기간
          </h2>

          <p className="mb-4">
            주다고 기준봉 센터는 개인정보 수집 및 이용 목적이 달성된 후에는 해당
            정보를 지체 없이 파기합니다. 다만 관련 법령에 따라 보관이 필요한
            경우에는 해당 기간 동안 보관할 수 있습니다.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              결제 및 구매 내역: 전자상거래 관련 법령에 따른 보관 기간 동안 보관
            </li>
            <li>
              환불 및 취소 기록: 분쟁 대응 및 거래 확인을 위해 필요한 기간 동안
              보관
            </li>
            <li>고객 문의 내역: 문의 처리 완료 후 3년간 보관 가능</li>
            <li>접속 기록: 관련 법령에 따라 필요한 기간 동안 보관 가능</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제4조 개인정보의 제3자 제공
          </h2>

          <p className="mb-4">
            주다고 기준봉 센터는 이용자의 개인정보를 원칙적으로 외부에 제공하지
            않습니다.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령에 따라 제출 의무가 있는 경우</li>
            <li>
              수사기관, 법원, 감독기관 등 법령상 권한 있는 기관의 적법한 요청이
              있는 경우
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제5조 개인정보 처리업무의 위탁
          </h2>

          <p className="mb-4">
            주다고 기준봉 센터는 원활한 서비스 제공을 위해 아래와 같이 개인정보
            처리업무를 위탁할 수 있습니다.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>결제대행사: 결제 승인, 결제 취소, 환불 처리, 결제 내역 확인</li>
            <li>
              웹사이트 호스팅 및 배포 서비스: 웹사이트 운영, 서버 관리, 배포
            </li>
            <li>
              데이터베이스 또는 백엔드 서비스: 구매 내역, 다운로드 권한, 문의
              내역 저장 및 관리
            </li>
            <li>
              이메일 발송 서비스: 구매 확인, 다운로드 안내, 문의 답변 발송
            </li>
          </ul>

          <p className="mt-4">
            주다고 기준봉 센터는 위탁업체가 개인정보를 안전하게 처리하도록
            필요한 사항을 관리합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제6조 개인정보의 파기 절차 및 방법
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              전자적 파일 형태의 개인정보: 복구 및 재생이 불가능한 방법으로 삭제
            </li>
            <li>종이 문서 형태의 개인정보: 분쇄 또는 소각</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제7조 이용자의 권리</h2>

          <p className="mb-4">
            이용자는 언제든지 자신의 개인정보에 대해 다음 권리를 행사할 수
            있습니다.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>개인정보 열람 요청</li>
            <li>개인정보 정정 요청</li>
            <li>개인정보 삭제 요청</li>
            <li>개인정보 처리정지 요청</li>
          </ul>

          <p className="mt-4">
            개인정보 관련 요청은 아래 이메일로 접수할 수 있습니다.
          </p>

          <p className="mt-2 font-medium">이메일: judago@naver.com</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제8조 쿠키의 사용</h2>

          <p>
            주다고 기준봉 센터는 서비스 이용 편의, 접속 기록 확인, 오류 분석
            등을 위해 쿠키를 사용할 수 있습니다.
          </p>

          <p className="mt-4">
            이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수
            있습니다. 다만 쿠키 저장을 거부할 경우 일부 기능 이용에 제한이 있을
            수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제9조 개인정보 보호책임자
          </h2>

          <ul className="space-y-2">
            <li>개인정보 보호책임자: 윤보석</li>
            <li>이메일: judago@naver.com</li>
            <li>연락처: 010-5007-1723</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            제10조 개인정보처리방침의 변경
          </h2>

          <p>
            본 개인정보처리방침은 관련 법령, 서비스 내용, 운영 방침에 따라
            변경될 수 있습니다.
          </p>

          <p className="mt-4">
            변경 사항이 있는 경우 웹사이트 공지사항 또는 별도 안내 페이지를 통해
            안내합니다.
          </p>

          <p className="mt-6 font-medium">시행일자: 2026년 06월 01일</p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
