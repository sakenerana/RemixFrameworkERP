import { Result } from "antd";

export default function PageNotExist() {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
        />
    );
}