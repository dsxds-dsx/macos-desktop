window.renderBooks = function(body, sidebar, toolbar, windowId) {
    let selectedBookId = null;
    let currentSection = 'library';
    let readingView = false;
    let currentPage = 0;
    let fontSize = 17;
    let currentChapter = 0;

    const books = [
        { id: '1', title: '三体', author: '刘慈欣', cover: '🌌', color: 'linear-gradient(135deg, #0a0e27, #1a1a3e)', progress: 0 },
        { id: '2', title: '西游记', author: '吴承恩', cover: '🐵', color: 'linear-gradient(135deg, #d4a017, #8b4513)', progress: 0 },
        { id: '3', title: '红楼梦', author: '曹雪芹', cover: '🌸', color: 'linear-gradient(135deg, #c0392b, #8e44ad)', progress: 0 },
        { id: '4', title: '水浒传', author: '施耐庵', cover: '⚔️', color: 'linear-gradient(135deg, #2c3e50, #34495e)', progress: 0 },
        { id: '5', title: '三国演义', author: '罗贯中', cover: '⚔️', color: 'linear-gradient(135deg, #8b0000, #2c3e50)', progress: 0 },
        { id: '6', title: '聊斋志异', author: '蒲松龄', cover: '🕯️', color: 'linear-gradient(135deg, #2c3e50, #1a1a2e)', progress: 0 },
        { id: '7', title: '岳飞传', author: '佚名', cover: '🏹', color: 'linear-gradient(135deg, #d35400, #c0392b)', progress: 0 },
        { id: '8', title: '封神演义', author: '许仲琳', cover: '🐉', color: 'linear-gradient(135deg, #6a1b9a, #283593)', progress: 0 }
    ];

    // 真实书籍内容（公有领域经典文学）
    const bookContents = {
        '2': {
            title: '西游记',
            author: '吴承恩',
            chapters: [
                {
                    title: '第一回 灵根育孕源流出 心性修持大道生',
                    content: `诗曰：混沌未分天地乱，茫茫渺渺无人见。自从盘古破鸿蒙，开辟从兹清浊辨。覆载群生仰至仁，发明万物皆成善。欲知造化会元功，须看西游释厄传。

盖闻天地之数，有十二万九千六百岁为一元。将一元分为十二会，乃子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥之十二支也。每会该一万八百岁。且就一日而论：子时得阳气，而丒则鸡鸣，寅不通光，而卯则日出。

且说那座花果山，正当顶上，有一块仙石。其石有三丈六尺五寸高，有二丈四尺围圆。三丈六尺五寸高，按周天三百六十五度；二丈四尺围圆，按政历二十四气。上有九窍八孔，按九宫八卦。

四面更无树木遮阴，左右倒有芝兰相衬。盖自开辟以来，每受天真地秀，日精月华，感之既久，遂有灵通之意。内育仙胞，一日迸裂，产一石卵，似圆球样大。因见风，化作一个石猴，五官俱备，四肢皆全。

那猴在山中，却会行走跳跃，食草木，饮涧泉，采山花，觅树果；与狼虫为伴，虎豹为群，獐鹿为友，猕猴为亲；夜宿石崖之下，朝游峰洞之中。

一朝天气炎热，与群猴避暑，都在松阴之下顽耍。一群猴子耍了一会，却去那山涧中洗澡。见那股涧水奔流，真个似滚瓜涌溅。古云："禽有禽言，兽有兽语。"众猴都道："这股水不知是那里的水。我们今日赶闲无事，顺涧边往上溜头寻看源流，耍子去耶！"

喊一声，都拖男挈女，唤弟呼兄，一齐跑来，顺涧爬山，直至源流之处，乃是一股瀑布飞泉。众猴拍手称扬道："好水！好水！原来此处远通山脚之下，直接大海之波。"又道："那一个有本事的，钻进去寻个源头出来，不伤身体者，我等就拜他为王。"

连呼了三声，忽见丛杂中跳出一个石猴，应声高叫道："我进去！我进去！"好猴！他瞑目蹲身，将身一纵，径直跳入瀑布泉中。睁睛抬头观看，那里边却无水无波，明明朗朗的一架桥梁。

住身定睛再看，原来是座铁板桥。桥下之水，冲贯于石窍之间，倒挂流出去，遮闭了桥门。却又欠身上桥头，再走再看，却似有人家住处一般，真个好所在。

看罢多时，跳过桥中间，左右观看，只见正当中有一石当中有一石碣。碣上有一行楷书大字，镌着"花果山福地，水帘洞洞天。"石猿喜不自胜，急抽身往外便走，复瞑目蹲身，跳出水外，打了两个呵呵道："大造化！大造化！"`

                },
                {
                    title: '第二回 悟彻菩提真妙理 断魔归本合元神',
                    content: `话表美猴王得了姓名，遂称孙行者。顿首谢了，即就躬身施礼，启道："师尊在上，弟子今日得蒙赐名，万望师尊传些道法，以期长生。"

须菩提祖师道："我今教你动字门中之道，就中有个'采阴补阳'，攀弓踏弩，摩脐过气，用方士之符咒，望取人之精血，以至乳煎烧铅，皆为旁门左道。此等事，益寿延年则有之，若欲长生，则不可得也。"

悟空道："师父，似这等也得长生么？"祖师道："要长生，亦如水中捞月。"悟空道："怎么叫做水中捞月？"祖师道："月在长空，水中有影，虽然看见，只是无捞摸处，到底只成空耳。"

悟空道："也不学！不学！"祖师闻言，咄的一声，跳下高台，手持戒尺，指定悟空道："你这猢狲，这般不学，那般不学，却待怎么？"走上前，将悟空头上打了三下，倒背着手，走入里面，关了中门。

大众俱惊，行者却暗喜。他当时坐下，心中暗想："祖师打我三下者，教我三更时分存心；倒背着手走入里面，将中门关上者，教我从后门进步，秘处传道也。"

当夜子时，悟空悄悄起来，从后门进去，直至祖师寝榻之下。祖师方才醒觉，翻身坐起。悟空跪在榻前道："弟子在此跪候多时。"

祖师道："你这猢狲，如何此际才来？"悟空道："师父昨日打我三下，教我三更来传道；背手入门，教从后门秘处传道。弟子故此大胆来此。"

祖师听了，十分欢喜，暗道："此子可教。"遂传与悟空长生妙诀，乃是显密圆通真妙诀。又传七十二般变化之法，及筋斗云，一纵十万八千里。`
                },
                {
                    title: '第三回 四海千山皆拱伏 九幽十类尽除名',
                    content: `却说孙行者得了金箍棒，在水晶宫中大显神威。龙王敖广及弟敖钦、敖闰、敖顺皆恐惧，只得献捧珠、凤翅、紫金冠、步云履、黄金甲。

行者穿戴毕，使动如意棒，一路打出来。四海龙王聚集兵将，意欲夺回兵器，却又惧他神通，只得商议上表天庭。

行者归山，每日操演猴兵，设阵练武，威震一方。又下东海索取披挂，闹龙宫，搅得四海不宁。

忽一日，行者醉卧山中。梦中见两人持牌来至，上写"孙行者"三字。二人以索套住行者魂灵，径扯至幽冥界。行者在生死簿上检看，乃"天产石猴"，该寿三百四十二岁，善终。

行者大怒，取笔将猴属之类，但有名者一概勾之。自此，山中之猴皆无生死，不入轮回。

当下捽下簿子，打出幽冥界。十代阎王不敢抵敌，齐齐商议上天庭告状。时东海龙王亦上表参奏。玉帝览奏，传旨着太白金星招安。`
                }
            ]
        },
        '3': {
            title: '红楼梦',
            author: '曹雪芹',
            chapters: [
                {
                    title: '第一回 甄士隐梦幻识通灵 贾雨村风尘怀闺秀',
                    content: `此开卷第一回也。作者自云：因曾历过一番梦幻之后，故将真事隐去，而借"通灵"之说，撰此《石头记》一书也。故曰"甄士隐"云云。

但书中所记何事何人？忽念及当日所有之女子，一一细考较去，觉其行止见识，皆出于我之上。何我堂堂须眉，诚不若彼裙钗哉？实愧则有之，悔则无益，真大无可如何之日也！

今风尘碌碌，一事无成，忽念及当日所有之女子，一一细考较去，觉其行止见识，皆出于我之上。我堂堂须眉，诚不若彼裙钗哉？

那红尘中有却有些乐事，但不能永远依恃。况又有"美中不足，好事多磨"八个字紧相连属，瞬息间则又乐极悲生，人非物换，究竟是到头一梦，万境归空。

当日地陷东南，这东南一隅有处曰姑苏，有城曰阊门者，最是红尘中一二等富贵风流之地。这阊门外有个十里街，街内有个仁清巷，巷内有个古庙，因地方狭窄，人皆呼作葫芦庙。

庙旁住着一家乡宦，姓甄，名费，字士隐。嫡妻封氏，性情贤淑，深明礼义。家中虽不甚富贵，然本地便也推他为望族了。因这甄士隐禀性恬淡，不以功名为念，每日只以观花修竹、酌酒吟诗为乐，倒是神仙一流人品。`
                },
                {
                    title: '第二回 贾夫人仙逝扬州城 冷子兴演说荣国府',
                    content: `诗云：一局输赢料不真，香销茶尽尚逡巡。欲知目下兴衰兆，须问旁观冷眼人。

却说封肃因听见公差传唤，忙出来陪笑启问。那些人只嚷："快请出甄爷来！"封肃忙陪笑道："小人姓封，并不姓甄。只有当日小婿姓甄，今已出家一二年了，不知可是问他？"

那些公人道："我们也不知什么'真''假'。因奉太爷之命来问，他既是你女婿，便带了你去面见太爷，便有话说。"

当下封肃听了，吓得目瞪口呆。恰遇雨村来访士隐，封肃便将此事告诉雨村。雨村亦叹。叙话间，雨村问及都中新闻，封肃便荐冷子兴与之闲谈。

冷子兴乃都中古董行中贸易之人，与雨村交好。雨村闲居无聊，每当风日晴和，饭后便出来闲步。这日偶至郭外，意欲赏鉴那村野风光。

忽信步至一山环水旋、茂林深竹之处，隐隐有座庙宇。门巷倾颓，墙垣朽败，门前有额，题曰"智通寺"。门旁又有一副旧破的对联，曰："身后有余忘缩手，眼前无路想回头。"雨村看了，因想到："这两句话，文虽浅近，其意则深。我也曾游过些名山大刹，倒不曾见过这话头。"

其中有个龙钟老僧在那里煮粥。雨村见了，便不在意。及至问他两句话，那老僧既聋且昏，齿落舌钝，所答非所问。`
                }
            ]
        },
        '4': {
            title: '水浒传',
            author: '施耐庵',
            chapters: [
                {
                    title: '第一回 张天师祈禳瘟疫 洪太尉误走妖魔',
                    content: `诗曰：绛帻鸡人报晓筹，尚衣方进翠云裘。九天阊阖开宫殿，万国衣冠拜冕旒。日色才临仙掌动，香烟欲傍衮龙浮。朝罢须裁五色诏，佩声归到凤池头。

话说大宋仁宗天子在位，嘉祐三年三月三日五更三点，天子升殿受百官朝贺。但见：祥云迷凤阁，瑞气罩龙楼。含烟御柳拂旌旗，带露宫花迎剑戟。

天香影里，玉簪珠履聚丹墀；仙乐声中，绣袄锦衣扶御驾。珍珠帘卷，黄金殿上现金舆；翡翠屏开，白玉阶前停宝辇。隐隐净鞭三下响，层层文武两班齐。

当有殿头官喝道："有事出班早奏，无事卷帘退朝。"只见班部丛中，宰相赵哲、参政文彦博出班奏曰："目今京师瘟疫盛行，伤损军民甚多。伏望陛下释罪宽恩，省刑薄税，以禳天灾。"

仁宗天子闻奏，急敕翰林院随即草诏。一面降赦天下罪囚，应有民间税赋悉皆赦免；一面命在京宫观寺院，修设好事禳灾。

不料其年瘟疫转盛。仁宗天子闻知，龙体不安，复会百官计议。有那参知政事范仲淹出班奏曰："目今天灾盛行，军民涂炭，日甚一日。以臣愚意，要禳此灾，可宣嗣汉天师星夜临朝，就京师禁院修设三千六百分罗天大醮，奏闻上帝，可以禳保民间瘟疫。"

仁宗天子准奏。急令翰林学士草诏，天子御笔亲书，诏命钦差太尉洪信为天使，前往江西信州龙虎山，宣请嗣汉天师张真人星夜来朝祈禳瘟疫。`
                },
                {
                    title: '第二回 王教头私走延安府 九纹龙大闹史家村',
                    content: `话说当时王进辞了母亲，上路迤逦前行。行了半月之上，来到一处，乃华阴县界。看看天色晚了，王进挑着担儿，跟在娘马后，趁着月明，迤逦走。

不到五七里，见一所大庄院。王进对庄客唱喏道："小人母子二人，贪走了些路，错过了宿店。来到这里，天色已晚，借贵庄歇息一宵。明日早行，依例拜纳房金。"

庄客道："且等一等，待我去通报庄主。"不多时，庄主出来，乃是一老汉。见王进母子，便请入庄。那老汉姓史，名太公，庄上只有一子，名唤史进，绰号九纹龙。

次日，王进因马槽损了，于庄上修整。史进在后院使棒，被王进看见。王进道："这棒也使得好了，只是有破绽，赢不得真好汉。"史进大怒，要与王进比试。

当下两人比棒。史进把棒使尽平生本事，却被王进一棒打翻。史进爬起来，纳头便拜，请王进为师。王进乃东京八十万禁军教头，枪棒无双。遂在史家村住了半年，将十八般武艺尽传与史进。`
                }
            ]
        },
        '5': {
            title: '三国演义',
            author: '罗贯中',
            chapters: [
                {
                    title: '第一回 宴桃园豪杰三结义 斩黄巾英雄首立功',
                    content: `词曰：滚滚长江东逝水，浪花淘尽英雄。是非成败转头空。青山依旧在，几度夕阳红。白发渔樵江渚上，惯看秋月春风。一壶浊酒喜相逢。古今多少事，都付笑谈中。

话说天下大势，分久必合，合久必分。周末七国分争，并入于秦。及秦灭之后，楚、汉分争，又并入于汉。汉朝自高祖斩白蛇而起义，一统天下，后来光武中兴，传至献帝，遂分为三国。

推其致乱之由，殆始于桓、灵二帝。桓帝禁锢善类，崇信宦官。及桓帝崩，灵帝即位，大将军窦武、太傅陈蕃共相辅佐。时有宦官曹节等弄权，窦武、陈蕃谋诛之，机事不密，反为所害。

自此宦竖弄权，朝政日非，以致天下人心思乱，盗贼蜂起。时巨鹿郡有兄弟三人，一名张角，一名张宝，一名张梁。那张角本是个不第秀才，因入山采药，遇一老人，碧眼童颜，手执藜杖，唤角至一洞中，授以天书三卷，名曰《太平要术》。

角得此书，晓夜攻习，能呼风唤雨，号为"太平道人"。中平元年正月内，疫毒流行，张角散施符水，为人治病，自称"大贤良师"。徒众日盛，乃立三十六方，大方万余人，小方六七千人，各立渠帅。

讹言："苍天已死，黄天当立；岁在甲子，天下大吉。"令人各以白土书"甲子"字于家中大门上。青、幽、徐、冀、荆、扬、兖、豫八州之人，家家侍奉大贤良师张角名字。

却说那涿县楼桑村，有一人姓刘，名备，字玄德。生得身长八尺，两耳垂肩，双手过膝，目能自顾其耳，面如冠玉，唇若涂脂。性宽和，寡言语，喜怒不形于色。素有大志，专好结交天下豪杰。

当日见了榜文，慨然长叹。随后一人厉声言曰："大丈夫不与国家出力，何故长叹？"玄德回视其人：身长八尺，豹头环眼，燕颔虎须，声若巨雷，势如奔马。玄德见他形貌异常，问其姓名。其人曰："某姓张，名飞，字翼德。"`
                },
                {
                    title: '第二回 张翼德怒鞭督邮 何国舅谋诛宦竖',
                    content: `且说玄德兄弟三人，助朱俊讨黄巾有功。俊表奏孙坚、刘备等功绩。朝廷降旨，封玄德为安喜县尉。玄德将兵散回乡里，止带亲随二十余人，与关、张到安喜县中赴任。

到县四月，督邮行部至县。玄德出郭迎接，见督邮施礼。督邮坐于马上，惟微以鞭指回答。关、张二公俱怒。

到县驿中，督邮南面高坐，玄德侍立阶下。良久，督邮问曰："刘县尉是何出身？"玄德曰："备乃中山靖王之后。自涿郡剿戮黄巾，大小三十余战，颇有微功，因得除今职。"

督邮大喝曰："汝诈称皇亲，虚报功绩！朝廷降诏，正要沙汰这等滥官污吏！"玄德喏喏连声而退。

归到县中，与县吏商议。吏曰："督邮作威作福，无非要贿赂耳。"次日，督邮先唤县吏去，勒令指称县尉害民。玄德自往解释，被督邮喝令左右赶出。

张飞大怒，睁圆环眼，咬碎钢牙，滚鞍下马，径入馆驿。把门人拦挡不住。直奔后堂，见督邮正坐厅上，将县吏绑倒在地。飞大喝："害民贼！认得我么？"

未及督邮开言，飞一把揪住头发，扯出馆驿，直到县前马桩上缚住。攀下柳条，去督邮两腿上着力鞭之，一连打折柳条十数枝。玄德闻之，慌忙来视，见飞大怒，乃急喝止。`
                }
            ]
        },
        '6': {
            title: '聊斋志异',
            author: '蒲松龄',
            chapters: [
                {
                    title: '考城隍',
                    content: `予姊丈之祖，宋公讳焘，邑廪生。一日，病卧，见吏人持牒，牵白马至，云："请赴试。"公言："主司未曾召，何遽赴试？"吏言："但乘马去，自知。"公不得已，上马从之。

至一城，如王者之都。俄至一官署，宏敞壮丽。上坐十余官，都不知何人，惟关壮缪可识。檐下设几、墩各二。先有一秀才坐其下，公便与连肩。几上各有笔札。俄题纸飞下。视之，有八字，云："一人二人，有心无心。"

二人文成，呈殿上。公文中有云："有心为善，虽善不赏；无心为恶，虽恶不罚。"诸神传赞不已。召公上，谕曰："河南缺一城隍，君称其职。"公方悟，顿首泣曰："辱膺宠命，何敢辞？但老母七旬，奉养无人，请得终其天年，惟听录用。"

上一帝王像者，即命稽母寿籍。有长须吏捧册翻阅一过，白："有阳算九年。"共踌躇间，关帝曰："不妨，令张生摄篆九年。"乃谓公："应即赴任，今推仁孝之心，给假九年，期至复当相召。"

又勉励秀才数语。二公稽首并下。秀才从公至郊外，赠以诗，都忘其词，中有"有花有酒春常在，无烛无灯夜自明"之句。公既骑马，别去。及归里，豁然已蘦。时公方死三日，母闻棺中呻吟，扶出之，半日始能语。`
                },
                {
                    title: '画皮',
                    content: `太原王生，早行，遇一女郎，独行甚急，裹足奔踔，步履维艰。见而顾之，乃二八姝丽。心相爱乐，问："何夙夜踽踽独行？"女曰："道途之言，无烦客问。"生曰："卿行不得，适我同车，何如？"女曰："得免徒步，幸甚。"

生乃载与俱归。掩扉置室中，匿之，不令人知。数日后，生妻陈氏觉之，疑女，令生遣去。生不肯，但云无之。

一日，入市遇一道士，见生，惊曰："君身有妖气。"生以其言异，诘之。道士曰："然。尔室何妖也？"生给曰："无之。"道士曰："妖气方新，不去将至大祸。"

生终不信。及归，斋门反拒不得入。乃逾垣入，至室，门已闭。窃于窗隙窥之，见一狞鬼，面翠色，齿巉巉如锯。铺人皮于榻上，执彩笔而绘之。已而掷笔，举皮如振衣状，披于身，遂为女子。

大惧，兽伏而出。急追道士，不知所往。遍迹之，遇于郊外。长跪乞救。道士曰："此物亦苦，甫能觅代者，予亦不忍伤其生。"乃以蝇拂授之，令挂寝门。

临别，约定三日候于东岳庙。生归，不敢入斋，乃寝于内室。夜分，闻门外戢戢有声，自怖不敢视，唤妻视之。妻见女来，手持蝇拂，殊不顾。迳入室，裂生腹，掬心而去。

妻号呼。婢烛之，生已死，血满床席。陈氏骇极，涕不敢出。明日，使弟二郎奔告道士。道士怒曰："我本哀之，鬼乃敢尔！"随之入室，怒曰："贱鬼！安敢无状！"`
                }
            ]
        },
        '7': {
            title: '岳飞传',
            author: '佚名',
            chapters: [
                {
                    title: '第一回 岳飞出世',
                    content: `话说宋朝徽宗年间，相州汤阴县有一人，姓岳名和，娶妻姚氏。姚氏怀胎十月，一日分娩之时，正值天降大雨，黄河决口。洪水滔滔，汹涌而至，岳和夫妇抱婴儿坐于瓮中，随水漂流。

幸赖瓮不沉，漂至一岸，得人救起。岳和已殁于水，姚氏抱儿得活。遂寄居汤阴，含辛茹苦，抚养其子，取名岳飞，字鹏举。

飞幼时家贫，不能延师，母乃自教之读书。又以树枝画沙为字，授飞识字。飞天性聪慧，过目不忘。稍长，有神力，能挽三百斤弓。母又授以武艺，教以忠孝大义。

一日，飞之恩师周侗，乃当世豪杰，善射。见飞资质不凡，收为弟子，授以兵法武艺。飞习之甚勤，尽得其妙。

周侗尝语飞曰："吾观汝资质，当为万夫之敌。他日若得志，当以忠义报国。"飞拜受教。后周侗病卒，飞服丧尽礼，岁岁祭扫不辍。

及飞弱冠，正逢金兵南侵，徽钦二帝蒙尘。康王即位于南京，是为高宗。飞投军报国，屡立战功，从卒伍而擢偏将。飞所部军纪严明，秋毫无犯，号曰"岳家军"，金人畏之，有"撼山易，撼岳家军难"之语。`
                },
                {
                    title: '第二回 枪挑小梁王',
                    content: `却说岳飞投军之后，屡立战功，升至统领。时值科举武试，岳飞前往京城应试。

考场上，考生众多。有梁王柴桂者，乃世袭王爵，武艺超群，号称天下第一。梁王素傲慢，不把岳飞放在眼里。及至比试，岳飞使出周侗所传枪法，神出鬼没。

二人对枪，你来我往，战了数十合。梁王力怯，渐落下风。岳飞一枪刺中梁王咽喉，登时落马毙命。众皆大惊。

主考官大怒，欲治岳飞死罪。幸有宗泽老将军在旁，见岳飞英勇，力保之。宗泽乃当世名将，见飞枪法精妙，知非凡人，乃奏请朝廷赦之。

朝廷准奏，赦岳飞无罪。宗泽遂收岳飞为部将，令其统兵抗金。岳飞自此如龙入大海，大展宏图，屡败金兵，威震天下。

后有诗赞曰：三十功名尘与土，八千里路云和月。莫等闲，白了少年头，空悲切。`
                }
            ]
        },
        '8': {
            title: '封神演义',
            author: '许仲琳',
            chapters: [
                {
                    title: '第一回 纣王女娲宫进香',
                    content: `古风一首：混沌初分盘古先，太极两仪四象悬。子天丑地人寅出，避除兽患有巢轩。天开于子任他灭，地辟于丑有山川。寅会生人循理出，斗米充饥世所传。

话说商纣王乃帝乙之第三子也。帝乙三子：长曰微子启，次曰微子衍，三曰受辛。帝乙游于御园，领众文武玩赏牡丹。因飞云阁塌了一梁，寿王托梁换柱，力大无穷。因首相商容、上大夫梅柏、赵启等上本立东宫，乃立寿王为太子。

后帝乙崩，寿王即位，立妲己为后，号曰纣王。都朝歌。纣王坐享太平，万民乐业，风调雨顺，国泰民安。四夷拱手，八方宾服。有八镇诸侯，各领方物，无不称臣。

纣王七年春二月，忽一日，纣王早朝升殿，设聚文武。但见：瑞气氤氲，紫电红光翥。只因丹书铁券，正道休祥。

纣王问群臣曰："女娲娘娘圣诞，正日是哪一日？"商容奏曰："三月十五日，乃女娲娘娘圣诞之辰。陛下当往女娲宫降香。"纣王曰："准奏。"

至期，纣王乘辇，随带两班文武，往女娲宫进香。但见：宫殿巍峨，金碧交辉。纣王瞻仰女娲圣像，容貌端丽，瑞彩翩跹，国色天姿，宛然如生。纣王见之，淫心顿起，遂题诗一首于粉壁之上：

凤鸾宝帐景非常，尽是泥金巧样妆。曲曲远山飞翠色，翩翩舞袖映霞裳。梨花带雨争娇艳，芍药笼烟骋媚妆。但得妖娆能举动，取回长乐侍君王。

首相商容见之，奏曰："女娲乃朝歌福神，保佑国家。陛下作诗亵渎，恐有灾祸。"纣王曰："寡人乃万乘之尊，作诗有何妨碍？"遂不纳谏。`
                }
            ]
        },
        '1': {
            title: '三体',
            author: '刘慈欣',
            chapters: [
                {
                    title: '第一章 科学边界',
                    content: `汪淼是一位纳米材料专家。这天下午，他被告知自己被列入了一个名为"科学边界"的神秘组织的调查名单。

"科学边界"是一个由各国顶尖科学家组成的松散学术组织，近年来有多名成员相继自杀。汪淼被邀请加入这个组织，以便警方了解内情。

在史强的陪伴下，汪淼参加了一次"科学边界"的聚会。聚会上，一位名叫申玉菲的女士引起了他的注意。她神色冷峻，言谈间透露出一种对世界本质的深刻理解。

"物理学不存在了。"申玉菲平静地说出了这句话，仿佛在说今天天气不错。

汪淼不理解这句话的含义。在他看来，物理定律是宇宙的基石，怎么可能不存在？直到几天后，他亲眼目睹了一个令人难以置信的现象——

他拍摄的照片上出现了一组神秘的倒计时数字。这组数字在每张照片上都不同，但都在递减。汪淼感到一阵彻骨的寒冷，他隐约意识到，有什么东西正在暗中观察着人类文明。

那天晚上，汪淼仰望星空。繁星如旧，但他在那些遥远的光点中感到了一种前所未有的威胁。他不知道的是，在四光年之外，另一个文明已经注视地球很久了。`
                },
                {
                    title: '第二章 三体游戏',
                    content: `汪淼收到了一个神秘的邀请，进入了一个名为"三体"的虚拟现实游戏。在游戏中，他看到了一个奇特的世界。

这个世界有一个太阳，但它不是稳定的。时而三日凌空，大地炙烤如火；时而长夜漫漫，万物冰封。文明在恒纪元与乱纪元之间反复诞生与毁灭。

汪淼以游戏者的身份，亲眼目睹了一个文明从蛮荒到辉煌，又从辉煌到毁灭的全过程。每一轮文明都留下了大量的科学与哲学遗产，却始终无法逃脱最终毁灭的命运。

"这个世界有三颗太阳。"游戏中的同伴告诉他，"它们以不可预测的方式运动，因此才有恒纪元与乱纪元之分。"

汪淼渐渐明白了，这不是一个简单的游戏。它所呈现的，是一个真实存在的文明——一个位于半人马座α星系的文明。

这个文明有一个名字：三体。

而汪淼所经历的一切，不过是三体文明漫长历史中的一个片段。他们的世界，正面临着前所未有的危机——三颗太阳的无序运动，使得这个世界即将在几百年内被其中一颗太阳吞噬。

三体人需要一个新的家园。

而他们的目光，投向了地球。`
                },
                {
                    title: '第三章 古筝行动',
                    content: `在一个雨夜，巴拿马运河上，一艘名为"审判日号"的巨轮正缓缓驶过。

船上的叶文洁，正是这一切的始作俑者。多年前，她在红岸基地向宇宙发出了一个信号，引来了三体文明的注意。从此，人类的命运被彻底改变。

在汪淼、史强等人的协助下，一场代号为"古筝行动"的秘密行动正在展开。行动的目标，是截获"审判日号"上可能存在的三体文明信息。

汪淼运用他在纳米材料方面的专业知识，设计了一个令人难以置信的装置。在运河狭窄处，他们布下了无数根肉眼几乎无法看见的纳米飞刃。这些飞刃比头发还细，却坚硬无比。

当"审判日号"驶过这片区域时，整艘船被无声地切成了一片片薄片。没有爆炸，没有声响，只有船身诡异地"解体"。

在碎片中，他们找到了叶文洁收集的大量关于三体文明的资料。这些资料揭示了一个令人战栗的真相：

三体人向地球发射了一种名为"智子"的微观粒子，锁死了人类的物理学研究。而更可怕的，是三体舰队已经启程，预计四百年后抵达地球。

人类，第一次面临着真正的存亡危机。`
                }
            ]
        }
    };

    function loadProgress() {
        books.forEach(book => {
            const saved = localStorage.getItem(`book_progress_${book.id}`);
            if (saved !== null) {
                book.progress = parseInt(saved);
            }
        });
    }

    function saveProgress(bookId, progress) {
        const book = books.find(b => b.id === bookId);
        if (book) {
            book.progress = progress;
            localStorage.setItem(`book_progress_${bookId}`, progress);
        }
    }

    function renderSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = `
            <div style="width:200px;height:100%;background:var(--sidebar-bg);border-right:0.5px solid var(--border-color);padding:16px;box-sizing:border-box;">
                <div style="font-size:22px;font-weight:700;margin-bottom:20px;">📚 图书</div>
                ${sections.map(sec => `
                    <div class="finder-sidebar-item ${currentSection === sec.id ? 'active' : ''}" data-section="${sec.id}" style="margin-bottom:2px;">
                        <span style="font-size:16px;">${sec.icon}</span>
                        <span style="font-size:13px;">${sec.name}</span>
                    </div>
                `).join('')}
            </div>
        `;
        sidebar.querySelectorAll('[data-section]').forEach(item => {
            item.addEventListener('click', () => {
                currentSection = item.dataset.section;
                selectedBookId = null;
                readingView = false;
                render();
            });
        });
    }

    function renderReadingView() {
        const book = books.find(b => b.id === selectedBookId);
        const content = bookContents[selectedBookId];
        if (!book || !content) {
            selectedBookId = null;
            readingView = false;
            renderContent();
            return;
        }

        const chapter = content.chapters[currentChapter];
        const paragraphs = chapter.content.split('\n\n');
        const totalPages = Math.ceil(paragraphs.length / 3);
        const pageParaStart = currentPage * 3;
        const pageParas = paragraphs.slice(pageParaStart, pageParaStart + 3);

        const totalProgress = Math.round(((currentChapter + (currentPage + 1) / totalPages) / content.chapters.length) * 100);

        body.innerHTML = `
            <div class="books-reader">
                <div class="books-reader-toolbar">
                    <button class="books-reader-btn" id="reader-back">← 书库</button>
                    <div class="books-reader-info">
                        <span class="books-reader-title">${book.title}</span>
                        <span class="books-reader-chapter">${chapter.title}</span>
                    </div>
                    <div class="books-reader-controls">
                        <button class="books-reader-btn-icon" id="font-decrease" title="缩小字体">A-</button>
                        <span style="font-size:12px;color:var(--text-tertiary);min-width:30px;text-align:center;">${fontSize}px</span>
                        <button class="books-reader-btn-icon" id="font-increase" title="放大字体">A+</button>
                    </div>
                </div>
                <div class="books-reader-page" id="reader-page" style="font-size:${fontSize}px;">
                    ${pageParas.map(p => `<p class="books-paragraph">${p.trim()}</p>`).join('')}
                </div>
                <div class="books-reader-nav">
                    <button class="books-reader-nav-btn" id="prev-chapter" ${currentChapter === 0 ? 'disabled' : ''}>上一章</button>
                    <div class="books-reader-progress">
                        <div class="books-progress-bar">
                            <div class="books-progress-fill" style="width:${totalProgress}%;"></div>
                        </div>
                        <span class="books-progress-text">${totalProgress}% · 第 ${currentPage + 1} / ${totalPages} 页</span>
                    </div>
                    <button class="books-reader-nav-btn" id="next-chapter" ${currentChapter === content.chapters.length - 1 && currentPage >= totalPages - 1 ? 'disabled' : ''}>下一章</button>
                </div>
            </div>
        `;

        document.getElementById('reader-back').addEventListener('click', () => {
            readingView = false;
            renderContent();
        });

        document.getElementById('font-decrease').addEventListener('click', () => {
            if (fontSize > 12) {
                fontSize -= 1;
                renderReadingView();
            }
        });

        document.getElementById('font-increase').addEventListener('click', () => {
            if (fontSize < 28) {
                fontSize += 1;
                renderReadingView();
            }
        });

        document.getElementById('prev-chapter').addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
            } else if (currentChapter > 0) {
                currentChapter--;
                const prevChapter = content.chapters[currentChapter];
                const prevParas = prevChapter.content.split('\n\n');
                currentPage = Math.max(0, Math.ceil(prevParas.length / 3) - 1);
            }
            renderReadingView();
        });

        document.getElementById('next-chapter').addEventListener('click', () => {
            const chapterParas = chapter.content.split('\n\n');
            const chPages = Math.ceil(chapterParas.length / 3);
            if (currentPage < chPages - 1) {
                currentPage++;
            } else if (currentChapter < content.chapters.length - 1) {
                currentChapter++;
                currentPage = 0;
            }
            renderReadingView();
        });

        saveProgress(selectedBookId, totalProgress);
    }

    function renderContent() {
        if (readingView && selectedBookId) {
            renderReadingView();
            return;
        }

        if (selectedBookId) {
            const book = books.find(b => b.id === selectedBookId);
            const content = bookContents[selectedBookId];
            if (!book) {
                selectedBookId = null;
                renderContent();
                return;
            }
            body.innerHTML = `
                <div class="books-detail">
                    <button class="books-back-btn" id="back-btn">← 返回书库</button>
                    <div class="books-detail-main">
                        <div class="books-cover-lg" style="background:${book.color};">${book.cover}</div>
                        <div class="books-detail-info">
                            <h1 class="books-detail-title">${book.title}</h1>
                            <div class="books-detail-author">${book.author}</div>
                            <div class="books-progress-section">
                                <div class="books-progress-header">
                                    <span>阅读进度</span>
                                    <span>${book.progress}%</span>
                                </div>
                                <div class="books-progress-bar-lg">
                                    <div class="books-progress-fill-lg" style="width:${book.progress}%;"></div>
                                </div>
                            </div>
                            <button class="books-read-btn" id="read-btn">${book.progress === 0 ? '开始阅读' : book.progress >= 100 ? '重新阅读' : '继续阅读'}</button>
                            ${content ? `
                                <div class="books-detail-toc">
                                    <div class="books-toc-title">目录</div>
                                    ${content.chapters.map((ch, i) => `
                                        <div class="books-toc-item" data-chapter="${i}">
                                            <span>${ch.title}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                            <div class="books-detail-desc">
                                <div class="books-desc-title">简介</div>
                                <div class="books-desc-text">${getBookDescription(book.id)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('back-btn').addEventListener('click', () => {
                selectedBookId = null;
                renderContent();
            });
            document.getElementById('read-btn').addEventListener('click', () => {
                if (book.progress >= 100) {
                    currentChapter = 0;
                    currentPage = 0;
                } else {
                    const content = bookContents[selectedBookId];
                    if (content) {
                        const totalChapters = content.chapters.length;
                        const targetChapter = Math.floor((book.progress / 100) * totalChapters);
                        currentChapter = Math.min(targetChapter, totalChapters - 1);
                        currentPage = 0;
                    }
                }
                readingView = true;
                renderReadingView();
            });
            body.querySelectorAll('.books-toc-item').forEach(item => {
                item.addEventListener('click', () => {
                    currentChapter = parseInt(item.dataset.chapter);
                    currentPage = 0;
                    readingView = true;
                    renderReadingView();
                });
            });
            return;
        }

        let displayBooks = books;
        let title = '全部图书';
        if (currentSection === 'reading') {
            displayBooks = books.filter(b => b.progress > 0 && b.progress < 100);
            title = '正在阅读';
        } else if (currentSection === 'finished') {
            displayBooks = books.filter(b => b.progress >= 100);
            title = '已读完';
        } else if (currentSection === 'bookstore') {
            title = '书店';
        }

        body.innerHTML = `
            <div class="books-grid-view">
                <h1 class="books-grid-title">${title}</h1>
                ${currentSection === 'bookstore' ? `
                    <div class="books-bookstore">
                        <div class="books-bookstore-icon">🏪</div>
                        <div class="books-bookstore-text">书库中已有 ${books.length} 本经典名著</div>
                        <div class="books-bookstore-hint">所有书籍均可免费阅读</div>
                    </div>
                ` : displayBooks.length === 0 ? `
                    <div class="books-empty">
                        <div class="books-empty-icon">📖</div>
                        <div>暂无书籍</div>
                    </div>
                ` : `
                    <div class="books-grid">
                        ${displayBooks.map(book => `
                            <div class="books-card" data-id="${book.id}">
                                <div class="books-cover" style="background:${book.color};">${book.cover}</div>
                                <div class="books-card-title">${book.title}</div>
                                <div class="books-card-author">${book.author}</div>
                                ${book.progress > 0 && book.progress < 100 ? `
                                    <div class="books-card-progress">
                                        <div class="books-card-progress-fill" style="width:${book.progress}%;"></div>
                                    </div>
                                ` : book.progress >= 100 ? `
                                    <div class="books-card-finished">✓ 已读完</div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;
        body.querySelectorAll('.books-card').forEach(item => {
            item.addEventListener('click', () => {
                selectedBookId = item.dataset.id;
                renderContent();
            });
        });
    }

    function getBookDescription(bookId) {
        const descs = {
            '1': '一部气势恢宏的科幻史诗。讲述了地球文明与三体文明之间跨越光年的交锋。在宇宙的黑暗森林中，两个文明的碰撞揭示了宇宙最深刻的法则。',
            '2': '中国古典四大名著之一。讲述了唐僧师徒四人西天取经的传奇故事。孙悟空大闹天宫、三打白骨精、火焰山等经典情节流传千古。',
            '3': '中国古典四大名著之一。以贾宝玉与林黛玉的爱情悲剧为主线，展现了贾府由盛到衰的历程，是中国封建社会的百科全书。',
            '4': '中国古典四大名著之一。讲述了北宋末年一百零八位好汉聚义梁山泊的故事。武松打虎、鲁智深倒拔垂杨柳等经典情节脍炙人口。',
            '5': '中国古典四大名著之一。讲述了东汉末年到三国归晋的历史。曹操、刘备、孙权三方争霸，诸葛亮、关羽、张飞等英雄辈出。',
            '6': '清代文言短篇小说集。蒲松龄以花妖狐魅的故事，讽刺世态人情。其中《画皮》《聂小倩》等篇被多次改编为影视作品。',
            '7': '讲述了南宋名将岳飞精忠报国的传奇一生。从岳飞出世、枪挑小梁王，到抗金北伐、风波亭遇害，展现了民族英雄的壮烈人生。',
            '8': '明代神魔小说。以武王伐纣为背景，讲述了阐教与截教仙人的斗法。姜子牙封神、哪吒闹海等故事广为流传。'
        };
        return descs[bookId] || '一本精彩的书籍，值得细细品读。';
    }

    function render() {
        body.className = 'window-body app-content';
        body.style.display = 'flex';
        renderSidebar();
        renderContent();
    }

    loadProgress();
    render();
};
