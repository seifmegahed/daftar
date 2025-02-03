import ErrorPage from "@/components/error";
import { Button } from "@/components/ui/button";
import { convertRequestAction } from "@/server/actions/user-requests/convert";
import { ConvertUserRequestErrorCodes } from "@/server/actions/user-requests/error-codes";
import { Link } from "@/i18n/routing";

async function Verify({ params }: { params: { code: string } }) {
  const [, error] = await convertRequestAction(params.code);

  if (error === null)
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-center text-4xl font-bold">
          Your account has been verified
        </h1>
        <h2 className="text-center">
          You can start using the application by signing is using the button
          below
        </h2>
        <div>
          <Link href="/login">
            <Button>Sign in</Button>
          </Link>
        </div>
      </div>
    );

  switch (error as ConvertUserRequestErrorCodes) {
    case ConvertUserRequestErrorCodes.InvalidCode:
      return <ErrorPage />;
    case ConvertUserRequestErrorCodes.UserAlreadyVerified:
      return (
        <div className="flex flex-col items-center justify-center gap-4">
          <ErrorPage
            title="User already verified"
            message="Try signing in, or contact the admin."
          />
          <Link href="/login">
            <Button>Sign in</Button>
          </Link>
        </div>
      );
    case ConvertUserRequestErrorCodes.VerificationCodeExpired:
      return (
        <div className="flex flex-col items-center justify-center gap-4">
          <ErrorPage
            title="Verification code expired"
            message="Sign up again to get a new code."
          />
        </div>
      );
    default:
      return (
        <div className="flex flex-col items-center justify-center gap-4">
          <ErrorPage message="Try Again" />
        </div>
      );
  }
}

export default Verify;
