
function Message() {
    // JSX: JavaScript XML
    const name = "user";
    if (name)
        return <h1>Hello {name}</h1>;
    return <h1>Hellow World</h1>;
}

export default Message;