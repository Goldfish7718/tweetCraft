const constructPrompt = (tweet: string, action: string, style: string) => {
    let prompt;

    if (action == "Enhance") {
        prompt = `${action} this tweet to be more ${style} and only return a single tweet. ${tweet}`
    } else {
        prompt = `Generate a ${style} tweet from the following information and only return a single tweet. ${tweet}`
    }

    return prompt;
}

export default constructPrompt