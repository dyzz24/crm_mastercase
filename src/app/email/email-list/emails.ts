

export const emails = [
    { emailNames: 'someone@insat.ru', idPost: 'someone', incoming: '41', sent: '5', fullName: 'Егоров Дмитрий Вячеславович',
    password: '12345' },
    { emailNames: 'next@insat.ru', idPost: 'next', incoming: '46', sent: '51', fullName: 'Смирнов Алексей Михайлович',
    password: '12345' },
    { emailNames: 'prev@insat.ru', idPost: 'prev', incoming: '0', sent: '0', fullName: 'Иванов Иван Иванович',
    password: '12345' },
];


export const lettersInbox = [
       { someone:
        [{ name: 'Алексей', caption: 'Собрание в 19-00', text: 'Сегодня одно собрание в 19-00 и тд и тп',
        avaSrc: '../assets/avatars/1men.png', time: '12:48', id: 0, status: 'new', spam: false, email: 'oleg@insat.ru',
        emailCopy: ['oleg@insat.ru', 'marketing@insat.ru'], messageCondition: ['inwork', 'haveAttach', 'important']},
        { name: 'Аркадий', caption: 'Встреча в столовой', text: 'Очень долгий текст о чем то другом',
        avaSrc: '../assets/avatars/2men.png', time: 'Сейчас' , id: 1, status: 'new', spam: false, emailCopy: ['marketing@insat.ru'],
        messageCondition: []
        },
        { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 2, spam: false,
                                                emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']},
        { name: 'Павел', caption: 'Другой текст Павла', text: `Разговор о чем-то другом,
                                                                Разговор о чем-то другом,
                                                                Разговор о чем-то другом`,
                                                        avaSrc: '../assets/avatars/3men.png', time: '12:48', id: 3, status: 'new',
                                                        spam: false, emailCopy: ['oleg@insat.ru', 'marketing@insat.ru'],
                                                        messageCondition: ['inwork']},
        { name: 'Дмитрий', caption: 'Собрание переносится на 20-00', text: `Сегодня одно собрание но оно будет
                                                                        не в 19-00 как сказал Алексей, а в 20-00 как сказал я`,
                                                                        avaSrc: '../assets/avatars/4men.png', time: '12:48', id: 4,
                                                                        spam: false, emailCopy: ['oleg@insat.ru'],
                                                                        messageCondition: ['inwork', 'haveAttach', 'important']},
        { name: 'Ольга', caption: 'Позвони Аркадию', text: 'Аркадий ждет твоего звонка сегодня в 19-00',
        avaSrc: '../assets/avatars/1wom.png', time: '23:12', id: 5, spam: false, emailCopy: [],
        messageCondition: ['important']},
     { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 6, status: 'new', spam: false,
                                                emailCopy: ['oleg@insat.ru', 'marketing@insat.ru'],
                                                messageCondition: ['inwork', 'haveAttach', 'important']},
                                                { name: 'Егор', caption: 'Деловые игры', text: `
                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                        avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 7, spam: false,
                                        emailCopy: [], messageCondition: ['inwork']},
                                        { name: 'Егор', caption: 'Деловые игры',
                                        text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                avaSrc: '../assets/avatars/2men.png', time: '16:48' , id: 8, spam: false,
                                emailCopy: ['oleg@insat.ru'], messageCondition: ['inwork', 'haveAttach', 'important']},
                                { name: 'Егор', caption: 'Деловые игры',
                                text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                        avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 9, spam: false,
                        emailCopy: ['marketing@insat.ru'], messageCondition: []},
                        { name: 'Егор', caption: 'Деловые игры',
                        text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 10, spam: false,
                emailCopy: [], messageCondition: ['important']},
                { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
        avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 11, spam: false, emailCopy: ['oleg@insat.ru', 'marketing@insat.ru'],
        messageCondition: []},
        { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 12, spam: false, emailCopy: [],
messageCondition: []},
{ name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
Слишком длинный текст для того что бы посмотреть как ведет себя блок,
Слишком длинный текст для того что бы посмотреть как ведет себя блок,
Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 13, spam: false, emailCopy: ['marketing@insat.ru'],
messageCondition: []},
{ name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
Слишком длинный текст для того что бы посмотреть как ведет себя блок,
Слишком длинный текст для того что бы посмотреть как ведет себя блок,
Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 14, spam: false, messageCondition: ['inwork', 'haveAttach', 'important']}
, { name: 'Ольга', caption: 'Позвони Аркадию', text: 'Аркадий ждет твоего звонка сегодня в 19-00',
avaSrc: '../assets/avatars/1wom.png', time: '23:12', id: 15, spam: false, emailCopy: [],
messageCondition: ['important']},
{ name: 'Ольга', caption: 'Позвони Аркадию', text: 'Аркадий ждет твоего звонка сегодня в 19-00',
avaSrc: '../assets/avatars/1wom.png', time: '23:12', id: 16, spam: false, emailCopy: [],
messageCondition: []}
,
{ name: 'Ольга', caption: 'Позвони Аркадию', text: 'Аркадий ждет твоего звонка сегодня в 19-00',
avaSrc: '../assets/avatars/1wom.png', time: '23:12', id: 17, spam: false, emailCopy: [],
messageCondition: []}
,
{ name: 'Ольга', caption: 'Позвони Аркадию', text: 'Аркадий ждет твоего звонка сегодня в 19-00',
avaSrc: '../assets/avatars/1wom.png', time: '23:12', id: 18, spam: false, emailCopy: [],
messageCondition: []}
,
{ name: 'Ольга', caption: 'Позвони Аркадию', text: 'Аркадий ждет твоего звонка сегодня в 19-00',
avaSrc: '../assets/avatars/1wom.png', time: '23:12', id: 19, spam: false, emailCopy: [],
messageCondition: []}
,
{ name: 'Ольга', caption: 'Позвони Аркадию', text: 'Аркадий ждет твоего звонка сегодня в 19-00',
avaSrc: '../assets/avatars/1wom.png', time: '23:12', id: 20, spam: false, emailCopy: [],
messageCondition: []}
,
                                                { name: 'Егор', caption: 'Деловые игры', text: `
                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                        avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 21, spam: false,
                                        emailCopy: [], messageCondition: ['inwork']}
                                        ,
                                        { name: 'Егор', caption: 'Деловые игры', text: `
                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 22, spam: false,
                                emailCopy: [], messageCondition: ['inwork']}
                                ,
                                { name: 'Егор', caption: 'Деловые игры', text: `
                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                        avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 23, spam: false,
                        emailCopy: [], messageCondition: ['inwork']}
                        ,
                        { name: 'Егор', caption: 'Деловые игры', text: `
                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 24, spam: false,
                emailCopy: [], messageCondition: ['inwork']}
                ,
                { name: 'Егор', caption: 'Деловые игры', text: `
                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
        avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 25, spam: false,
        emailCopy: [], messageCondition: ['inwork']}
        ,
        { name: 'Егор', caption: 'Деловые игры', text: `
        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 26, spam: false,
emailCopy: [], messageCondition: ['inwork']}
,
                                                { name: 'Егор', caption: 'Деловые игры', text: `
                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                        avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 27, spam: false,
                                        emailCopy: [], messageCondition: ['inwork']}
                                        ,
                                        { name: 'Егор', caption: 'Деловые игры', text: `
                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 28, spam: false,
                                emailCopy: [], messageCondition: ['inwork']}
                                ,
                                { name: 'Егор', caption: 'Деловые игры', text: `
                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                        avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 29, spam: false,
                        emailCopy: [], messageCondition: ['inwork']}
                        ,
                        { name: 'Егор', caption: 'Деловые игры', text: `
                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 30, spam: false,
                emailCopy: [], messageCondition: ['inwork']}
                ,
                { name: 'Егор', caption: 'Деловые игры', text: `
                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
        avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 31, spam: false,
        emailCopy: [], messageCondition: ['inwork']}
        ,
        { name: 'Егор', caption: 'Деловые игры', text: `
        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 32, spam: false,
emailCopy: [], messageCondition: ['inwork']}
,
                        { name: 'Егор', caption: 'Деловые игры', text: `
                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 33, spam: false,
                emailCopy: [], messageCondition: ['inwork']}
                ,
                { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                        avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 34, spam: false,
                                                        emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']}
                                                ,
        { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 35, spam: false,
                                                emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']}
                                        ,
        { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 36, spam: false,
                                                emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']}
                                        ,
        { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 37, spam: false,
                                                emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']}
                                        ,
        { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 38, spam: false,
                                                emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']},
                { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                        avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 39, spam: false,
                                                        emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']}
                                                ,
        { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 40, spam: false,
                                                emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']}
                                        ,
        { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 41, spam: false,
                                                emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']}
                                        ,
        { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 42, spam: false,
                                                emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']}
                                        ,
        { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 43, spam: false,
                                                emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']}
                                        ,
                { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                        avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 44, spam: false,
                                                        emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']}
                                                ,
        { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 45, spam: false,
                                                emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']}
                                        ,
        { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 46, spam: false,
                                                emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']}
                                        ,
        { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 47, spam: false,
                                                emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']}
                                        ,
        { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 48, spam: false,
                                                emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']},
                { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                                Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                        avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 49, spam: false,
                                                        emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']}
                                                ,
        { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 50, spam: false,
                                                emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']}
                                        ,
        { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 51, spam: false,
                                                emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']}
                                        ,
        { name: 'Егор', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 52, spam: false,
                                                emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']}
                                        ,
        { name: 'Конец писем', caption: 'Деловые игры', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                        Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                avaSrc: '../assets/avatars/2men.png', time: '16:48', id: 53, spam: false,
                                                emailCopy: ['oleg@insat.ru'], messageCondition: ['haveAttach', 'inwork']}],

       },

       { next:
        [{ name: 'Андрей', caption: 'Отпуск по болезни', text: 'Беру отпуск на неделю',
        avaSrc: '../assets/avatars/2men.png', time: '12:48', id: 0, spam: false, emailCopy: ['copy@insat.ru'],
        messageCondition: ['inwork', 'haveAttach', 'important']},
        { name: 'Егор', caption: 'Собрание в 19-00', text: '26.08 в 19-00 и собрание', avaSrc: '../assets/avatars/1men.png', time: '23:12',
        id: 1, status: 'new', spam: false, emailCopy: ['copy@insat.ru'], messageCondition: ['inwork', 'haveAttach', 'important']},
        { name: 'Андрей', caption: 'Отпуск по болезни', text: 'Беру отпуск на неделю', avaSrc: '../assets/avatars/3men.png', time: '12:48'
        , id: 2, spam: false, emailCopy: [], messageCondition: ['haveAttach', 'important']},
        { name: 'Егор', caption: 'Собрание в 19-00', text: '26.08 в 19-00 и собрание', avaSrc: '../assets/avatars/4men.png', time: '12:48',
        id: 3, spam: false, emailCopy: ['copy@insat.ru'], messageCondition: ['inwork', 'haveAttach', 'important']}]
       },
       {
        prev: 'noMessages'
       }

    ];

    export const lettersSent = [
        { someone:
         [{ name: 'Алексей', caption: 'Собрание в 19-00', text: 'Хорошо, постараюсь не опаздать как в тот раз, ура ура',
         avaSrc: '../assets/avatars/1men.png', time: '4:13', id: 0},
         { name: 'Аркадий', caption: 'Пора перейти на "ты"', text: 'Пора бы уже нам с тобой перейти на ты, как ты считаешь?',
         avaSrc: '../assets/avatars/2men.png', time: '12:48', id: 1, },
         { name: 'Павел', caption: 'Коммерческое предложение', text: `Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                         Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                         Слишком длинный текст для того что бы посмотреть как ведет себя блок,
                                                         Слишком длинный текст для того что бы посмотреть как ведет себя блок`,
                                                         avaSrc: '../assets/avatars/3men.png', time: '12:48', id: 2, },
         { name: 'Павел', caption: 'Повторное предложение о партнерстве', text: `Разговор о нашем партнерстве,
                                                                 думаю есть о чем поговорить,
                                                                 хотя как знать`, avaSrc: '../assets/avatars/2men.png', time: '12:48',
                                                                 id: 3},
         { name: 'Дмитрий', caption: 'Переговоры с партнерами', text: `Переговоры с партнерами завершились очень успешно, отправляю отчет`
         , avaSrc: '../assets/avatars/2men.png', time: '11:48', id: 4},
         { name: 'Олег', caption: 'Не забудь поздравить Ольгу', text: 'У нее после-завтра день рождения',
         avaSrc: '../assets/avatars/4men.png', time: '10:48', id: 5}]
        },
        { next:
         [{ name: 'Ольга', caption: 'Буду в четверг', text: 'Если всё пройдет хорошо, буду в четверг',
         avaSrc: '../assets/avatars/2wom.png', time: '12:48', id: 0},
         { name: 'Егор', caption: 'Собрание в 19-00', text: 'Передай остальным', avaSrc: '../assets/avatars/1men.png', time: '7:48', id: 1},
         { name: 'Андрей', caption: 'Ответ на прошлогоднее письмо', text: `Не смог сразу ответитить и
                                    случайно обнаружил данное письмо, так вот`, avaSrc: '../assets/avatars/2men.png', time: '4:48', id: 2},
         { name: 'Егор', caption: 'Собрание в 19-00', text: '26.08 в 19-00 и собрание', avaSrc: '../assets/avatars/4men.png',
         time: '16:48', id: 3}]
        },
        {
                prev:  [
                        { name: 'Дмитрий', caption: 'Переговоры с партнерами',
                        text: `Переговоры с партнерами завершились очень успешно, отправляю отчет`
                , avaSrc: '../assets/avatars/2men.png', time: '11:48', id: 0}]
               }
     ];
