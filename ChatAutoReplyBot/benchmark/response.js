importClass(java.lang.System);

const PREFIX = "benchmark ";
const REPEAT_COUNT = {
    radius: 10000000,
    fibonacci: 30
};

function response(room, message, s, g, replier) {
    if (message.startsWith(PREFIX)) {
        let arg = message.drop(PREFIX);
        let loop;
        try {
            loop = Number(arg);
        } catch (e) {
            replier.reply("Illegal loop count: " + arg);
        }
        
        replier.reply(getDeviceInfo());

        replier.reply("Preheating..");
        repeatf(REPEAT_COUNT.radius, radiusCalc);
        
        replier.reply("Starting benchmark with " + loop + " loops...");
        
        let globalStart = millis();
        
        const results = [];
        repeatf(loop, (index) => {
            const duration = runBenchmark();
            results.push(duration);
            //replier.reply("Loop#" + index + " : " + duration + "ms");
        }); 
        
        let globalEnd = millis();
        
        replier.reply("Benchmark completed in " + (globalEnd - globalStart) + "ms");
        replier.reply(results.map((v, i) => "Result#" + i + " : " + v + "ms").join("\n"));
        replier.reply("Overall: " + (results.sum() / loop).toFixed(4));
    }
}

const runBenchmark = () => {
    let startMillis = millis();
    
    repeatf(REPEAT_COUNT.radius, radiusCalc);
    repeatf(REPEAT_COUNT.fibonacci, fibonacciCalc);
    
    let endMillis = millis();
    return endMillis - startMillis;
};

const radiusCalc = (radius) => {
    return 0.5 * radius * radius * Math.PI;
};

const fibonacciCalc = (n) => {
    if(n <= 1)
        return 1;
    else
        return fibonacciCalc(n - 1) + fibonacciCalc(n - 2);
}

const millis = () => System.currentTimeMillis();

const repeatf = (count, block) => {
    for (let i = 0; i < count; i++) {
        block(i);
    }
};

Array.prototype.sum = function() {
    return this.reduce(function add(sum, cursor) {
      return sum + cursor;
    }, 0);
}

const getDeviceInfo = () => {
    return "　- Environment Info -" + 
    "\nDeviceModel:　" + Device.getPhoneModel() +
    "\nVersionName:　" + Device.getAndroidVersionName() + 
    "\nVersionCode:　" + Device.getAndroidVersionCode();
};

String.prototype.drop = function(index) {
    let mIndex = typeof index == "string" ? index.length : index;
    if (mIndex < 0) {
        return this.substring(0, this.length + mIndex);
    } else {
        return this.substring(mIndex, this.length);
    }
};

