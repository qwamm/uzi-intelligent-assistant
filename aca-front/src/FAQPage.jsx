import * as React from 'react';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import Typography from '@mui/material/Typography';
import {Accordion, AccordionDetails, AccordionSummary, Box} from "@mui/material";


export default function CustomizedAccordions() {
    const [expanded, setExpanded] = React.useState(null);

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };



    return (
        <Box component={""} sx={{
            backgroundColor: '#ffffff',
            paddingLeft: 10,
            paddingTop: 10,
            paddingBottom: 10,
            borderTopLeftRadius: 80,
            borderTopRightRadius: 80,
            borderBottomLeftRadius: 80,
            borderBottomRightRadius: 80,
            height: 'auto',
            minHeight: 600,
            width: 'auto',
            minWidth: 500,
            '&:hover': {
                backgroundColor: "#ffffff",
            }
        }} >
            <Typography component={""} variant={'h2'} align={'center'} fontWeight={'normal'} fontFamily={'Roboto'} color={'dimgray'} sx={{}}>Как использовать ассистента?</Typography>
            <Accordion sx={{marginBlock: 3}} elevation={0} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
                                  aria-controls="panel2d-content" id="panel2d-header" sx={{flexDirection: 'row-reverse',
                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                        transform: 'rotate(90deg)', color: '#2292cb',  marginRight: 3
                    },
                    '& .MuiAccordionSummary-content': {
                        marginLeft: 3,
                    },
                }}>
                    <Typography component={""} variant={'h7'} fontWeight={'normal'} fontStyle={{color: expanded === 'panel1'? '#2292cb': 'dimgray'}}>Как войти в систему?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography component={""} variant={'h7'} fontWeight={'lighter'}>
                        Для входа в систему воспользуйтесь выданными эл. почтой и паролем.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{marginBlock: 3}} elevation={0} expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
                                  aria-controls="panel2d-content" id="panel2d-header" sx={{flexDirection: 'row-reverse',
                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                        transform: 'rotate(90deg)', color: '#2292cb',  marginRight: 3
                    },
                    '& .MuiAccordionSummary-content': {
                        marginLeft: 3,
                    },
                }}>
                    <Typography component={""} variant={'h7'} fontWeight={'normal'} fontStyle={{color: expanded === 'panel2'? '#2292cb': 'dimgray'}}>Как создать новый аккаунт?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography component={""} variant={'h7'} fontWeight={'lighter'}>
                        Для того, чтобы создать новый аккаунт, Вам необходимо сначала <b>войти с выданными
                        данными для авторизации</b>: эл. почтой и паролем. После этого вы можете нажать на опцию <b>"Выйти"</b> и создать новый аккаунт.
                        Для этого под полями ввода эл.почты и пароля на страницк "Войти"
                        необходимо выбрать режим <b>"Зарегистрироваться"</b>. Для создания аккаунта обязаельно заполнение
                        всех полей формы и создание надежного пароля.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{marginBlock: 3}} elevation={0} expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <AccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
                                  aria-controls="panel2d-content" id="panel2d-header" sx={{flexDirection: 'row-reverse',
                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                        transform: 'rotate(90deg)', color: '#2292cb', marginRight: 3
                    },
                    '& .MuiAccordionSummary-content': {
                        marginLeft: 3,
                    },
                }}>
                    <Typography component={""} variant={'h7'} fontWeight={'normal'} fontStyle={{color: expanded === 'panel3'? '#2292cb': 'dimgray'}}>Как загрузить новый снимок?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography component={""} variant={'h7'} fontWeight={'lighter'}>
                        Для загрузки нового снимка перейдите в раздел<b> "Добавить снимок"</b>.
                    </Typography>
                    <Typography component={""} variant={'h7'} fontWeight={'lighter'}>
                        <p/>В данном разделе необходимо заполнить все поля. Для лучшего результата выберите наиболее подходящий аппарат УЗИ
                        и тип проекции.
                        <p/>Снимок можно присвоить стандартному пациенту, который будет находиться в списке первым. Если Вы хотите сразу занести
                        результат в карту определенного пациента, то можете выбрать его из списка пациентов. Если пациент отсутствует в списке, Вы можете создать
                        новую карту нажав на "Добавить нового пациента".
                        <p/>Для загрузки снимка нажмите на "+" справа от форм ввода информации. Снимок может быть в формате <b>.tiff</b> или <b>.png</b>.
                        <p/>После заполнения всех полей нажмите на "Провести диагностику". Если в левом углу появится зеленое предупреждение с надписью
                        "Снимок загружен!", все поля были заполнены верно и можно открыть результаты диагностики, нажав на "Посмотреть результат".
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{marginBlock: 3}} elevation={0} expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                <AccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
                                  aria-controls="panel2d-content" id="panel2d-header" sx={{flexDirection: 'row-reverse',
                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                        transform: 'rotate(90deg)', color: '#2292cb',  marginRight: 3
                    },
                    '& .MuiAccordionSummary-content': {
                        marginLeft: 3,
                    },
                }}>
                    <Typography component={""} variant={'h7'} fontWeight={'normal'} fontStyle={{color: expanded === 'panel4'? '#2292cb': 'dimgray'}}>Что делать, если некоторые снимки не открылись?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography component={""} variant={'h7'} fontWeight={'lighter'}>
                        Файлы большого размера действительно могут обрабатываться дольше, чем вы получите возможность посмотреть результат.
                    </Typography>
                    <Typography component={""} variant={'h7'} fontWeight={'lighter'}>
                        <p/>В этом нет ничего страшного. Надпись "Снимок анализируется" означает, что ассистент еще обрабатывает результат, и как только снимок
                        обработается, он сразу же появится на месте пустых разделов.
                        <p/>Пока идет обработка, Вы можете изменить данные по диагностике: заполнить эхографические признаки или присвоить определенный Вами тип узла.
                        <p/><b>Не забудьте сохранить </b>введенные данные, нажав на <b>"Сохранить результат"</b>.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{marginBlock: 3}} elevation={0} expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
                <AccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
                                  aria-controls="panel2d-content" id="panel2d-header" sx={{flexDirection: 'row-reverse',
                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                        transform: 'rotate(90deg)', color: '#2292cb',  marginRight: 3
                    },
                    '& .MuiAccordionSummary-content': {
                        marginLeft: 3,
                    },
                }}>
                    <Typography component={""} variant={'h7'} fontWeight={'normal'} fontStyle={{color: expanded === 'panel5'? '#2292cb': 'dimgray'}}>Что делать, если я хочу сохранить снимок?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography component={""} variant={'h7'} fontWeight={'lighter'}>
                        Для этого необходимо нажать на "Сохранить" над картинкой, которую Вы хотели бы сохранить на свой компьютер.
                    </Typography>

                </AccordionDetails>
            </Accordion>
            <Accordion sx={{marginBlock: 3}} elevation={0} expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
                <AccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
                                  aria-controls="panel2d-content" id="panel2d-header" sx={{flexDirection: 'row-reverse',
                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                        transform: 'rotate(90deg)', color: '#2292cb',  marginRight: 3
                    },
                    '& .MuiAccordionSummary-content': {
                        marginLeft: 3,
                    },
                }}>
                    <Typography component={""} variant={'h7'} fontWeight={'normal'} fontStyle={{color: expanded === 'panel6'? '#2292cb': 'dimgray'}}>Что делать, если я не могу согласиться с результатами анализа?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography component={""} variant={'h7'} fontWeight={'lighter'}>
                        Для таких случаев предусмотрен механизм публикации материалов на ресурс.
                    </Typography>
                    <Typography component={""} variant={'h7'} fontWeight={'lighter'}>
                        <p/> Для того, чтобы воспользоваться данной функцией, Вам необходимо нажать на "Добавить результат на ресурс". Нажатие перенаправит Вас на редактор масок для обучения.
                        <p/>В данном редакторе у Вас есть возможность выделения положения узла на исходном снимке и выбора определенного Вами типа узла по EU TI-RADS. Не забудьте <b>сохранить</b>,
                        нажав на <b>иконку дискеты </b>
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{marginBlock: 3}} elevation={0} expanded={expanded === 'panel7'} onChange={handleChange('panel7')}>
                <AccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
                                  aria-controls="panel2d-content" id="panel2d-header" sx={{flexDirection: 'row-reverse',
                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                        transform: 'rotate(90deg)', color: '#2292cb',  marginRight: 3
                    },
                    '& .MuiAccordionSummary-content': {
                        marginLeft: 3,
                    },
                }}>
                    <Typography component={""} variant={'h7'} fontWeight={'normal'} fontStyle={{color: expanded === 'panel7'? '#2292cb': 'dimgray'}}>Как посмотреть предыдущие диагностики?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography component={""} variant={'h7'} fontWeight={'lighter'}>
                        Для этого необходимо зайти в список пациентов, нажав на "Пациенты".
                    </Typography>
                    <Typography component={""} variant={'h7'} fontWeight={'lighter'}>
                        <p/> В данном разделе будут находится все пациенты, добавленные в систему.
                        Для открытия всей информации о пациенте необходимо нажать "Открыть карту". Карты пациентов можно фильтровать или сортировать для более удобного поиска. Для этого необходимо нажать на три точки рядом с одним из заголовков
                        таблицы.
                        <p/>В данном разделе так же можно добавить нового пациента, нажав на "+".
                        <p/> В разделе "Снимки", куда вы перейдете после открытия карты, будут находится все преддущие диагностики пациента, добавленные в систему.
                        Для открытия всей информации о диагностике необходимо нажать "Открыть результат". Диагностики можно фильтровать или
                        сортировать для более удобного поиска. Для этого необходимо нажать на три точки рядом с одним из заголовков
                        таблицы.
                        <p/>В данном разделе так же можно добавить новый снимок, нажав на "+". Или отредактировать информацию о пациенте, нажав на иконку карандаша.
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}