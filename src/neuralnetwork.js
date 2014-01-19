/*
 * The MIT License (MIT)

Copyright (c) 2014 Tomoya Tanaka

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */


function Identifyable() {
}
Identifyable.prototype.generateId = (function() {
    var count = 0;
    return function() {
        return count++;
    };
})();

/**
 * 
 * @returns {Synapse}
 */
function Synapse() {
    var id = this.generateId();
    /**
     * 
     * @returns Number
     */
    this.getId = function() {
        return id;
    };

    /**
     * 
     * @type Number
     */
    this.input = 0;
    /**
     * 
     * @type Number
     */
    this.weight = 1.0;
}
Synapse.prototype = new Identifyable();
/**
 * 
 * @returns {Number}
 */
Synapse.prototype.getOutput = function() {
    return this.input * this.weight;
};
/**
 * 
 * @returns {Number}
 */
Synapse.prototype.getWeight = function() {
    return this.weight;
};
/**
 * 
 * @param {Number} input
 * @returns {undefined}
 */
Synapse.prototype.setInput = function(input) {
    this.input = input;
};

/**
 * 
 * @param {type} weight
 * @returns {undefined}
 */
Synapse.prototype.setWeight = function(weight) {
    this.weight = weight;
};


function TransferFunctionStrategy() {
}
TransferFunctionStrategy.prototype.execute = function execute(x) {
};
/**
 * 
 * @param {Number} outputValue
 * @returns {Number}
 */
TransferFunctionStrategy.prototype.differentiated = function(outputValue) {
};
/**
 * 
 * @returns {SigmoidFunction}
 */
function SigmoidFunction() {
}
SigmoidFunction.prototype = new TransferFunctionStrategy();
/**
 * 
 * @param {Number} x
 * @returns {Number}
 */
SigmoidFunction.prototype.execute = function(x) {
    return (1 / (1 + Math.exp(-(x))));
};
/**
 * 
 * @param {Number} outputValue
 * @returns {Number}
 */
SigmoidFunction.prototype.differentiated = function(outputValue) {
    return outputValue * (1.0 - outputValue);
};

/**
 * 
 * @returns {PassThroughFunction}
 */
function PassThroughFunction() {
}
PassThroughFunction.prototype = new TransferFunctionStrategy();
/**
 * 
 * @param {Number} x
 * @returns {Number}
 */
PassThroughFunction.prototype.execute = function execute(x) {
    return x;
};
/**
 * 
 * @param {Number} outputValue
 * @returns {Number}
 */
PassThroughFunction.prototype.differentiated = function(outputValue) {
    return outputValue;
};

function Neuron(functionStrategy) {
    /**
     * @type Number
     */
    var id = this.generateId();
    this.getId = function() {
        return id;
    };
    /**
     * 
     * @type {Object.<string, Synapse>} 
     */
    this.inputSynapses = {};

    /**
     * 
     * @type {Object.<string, Synapse>} 
     */
    this.outputSynapses = {};
    /**
     * 
     * @type Number
     */
    this.bias = 0;

    /**
     * 
     * @type TransferFunctionStrategy
     */
    this.functionStrategy;

    if (functionStrategy) {
        this.functionStrategy = functionStrategy;
    } else {
        this.functionStrategy = new SigmoidFunction();
    }

}
Neuron.prototype = new Identifyable();
/**
 * 
 * @param {Identifyable} connectable
 * @param {Synapse} synapse
 * @returns {undefined}
 */
Neuron.prototype.addInputSynapse = function(connectable, synapse) {
    this.inputSynapses[connectable.getId()] = synapse;
};
/**
 * 
 * @param {Identifyable} connectable
 * @param {Synapse} synapse
 * @returns {undefined}
 */
Neuron.prototype.addOutputSynapse = function(connectable, synapse) {
    this.outputSynapses[connectable.getId()] = synapse;
};

/**
 * 
 * @param {Identifyable} postsynapticNeuron
 * @returns {undefined}
 */
Neuron.prototype.connect = function(postsynapticNeuron) {
    var synapse = new Synapse();
    this.addOutputSynapse(postsynapticNeuron, synapse);
    postsynapticNeuron.addInputSynapse(this, synapse);
};

Neuron.prototype.getBias = function() {
    return this.bias;
};
/**
 * 
 * @param {Identifyable} connectable
 * @returns {Synapse}
 */
Neuron.prototype.getInputSynapse = function(connectable) {
    return this.inputSynapses[connectable.getId()];
};

Neuron.prototype.getInputSynapses = function() {
    return this.inputSynapses;
};
/**
 * 
 * @returns {Neuron.prototype@pro;functionStrategy@call;execute}
 */
Neuron.prototype.getOutput = function() {
    var sum = 0.0;

    for (var key in this.inputSynapses) {
        var synapse = this.inputSynapses[key];
        sum += synapse.getOutput();
    }
    return this.functionStrategy.execute(sum + this.getBias());
};
/**
 * 
 * @param {Identifyable} connectable
 * @returns {Synapse}
 */
Neuron.prototype.getOutputSynapse = function(connectable) {
    return this.outputSynapses[connectable.getId()];
};
/**
 * 
 * @returns {Neuron.outputSynapses}
 */
Neuron.prototype.getOutputSynapses = function() {
    return this.outputSynapses;
};
/**
 * 
 * @returns {undefined}
 */
Neuron.prototype.run = function() {
    for (var id in this.outputSynapses) {
        this.outputSynapses[id].setInput(this.getOutput());
    }
};
/**
 * 
 * @param {Number} bias
 * @returns {undefined}
 */
Neuron.prototype.setBias = function(bias) {
    this.bias = bias;
};
/**
 * 
 * @returns {Neuron.functionStrategy}
 */
Neuron.prototype.getTransferFunction = function() {
    return this.functionStrategy;
};

function HierarchalNeuralNetwork() {
    var id = this.generateId();
    /**
     * 
     * @returns Number
     */
    this.getId = function() {
        return id;
    };
    /**
     * 
     * @type Array
     */
    this.layers = [];

    /**
     * 
     * @type Array.<Synapse>
     */
    this.inputSynapses = [];

    var numberOfNeurons = arguments;

    var layers = [];

    var inputLayer = new Array(numberOfNeurons[0]);
    var passThroughFunction = new PassThroughFunction();
    for (var i = 0; i < inputLayer.length; i++) {
        inputLayer[i] = new Neuron(passThroughFunction);
    }
    layers[0] = inputLayer;

    for (var j = 1; j < numberOfNeurons.length; j++) {
        var previousLayer = new Array(numberOfNeurons[j]);
        for (var k = 0; k < previousLayer.length; k++) {
            previousLayer[k] = new Neuron();
        }
        layers[j] = previousLayer;
    }
    this.initialize(layers);

}
HierarchalNeuralNetwork.prototype = new Identifyable();
HierarchalNeuralNetwork.prototype.conectNeuronsToPostsynapticNeurons = function(neurons, postsynapticNeurons) {
    for (var pre in neurons) {
        var neuron = neurons[pre];
        for (var post in postsynapticNeurons) {
            var postsynapticNeuron = postsynapticNeurons[post];
            neuron.connect(postsynapticNeuron);
            neuron.getOutputSynapse(postsynapticNeuron).setWeight(this.generateWeight());
        }
    }
};
HierarchalNeuralNetwork.prototype.connect = function(post) {
    var outputLayer = this.getOutputLayer();
    for (var i = 0; i < post.inputSynapses.length; i++) {
        outputLayer[i].addOutputSynapse(post, post.inputSynapses[i]);
    }
};
HierarchalNeuralNetwork.prototype.getInputLayer = function() {
    return this.layers[0];
};
HierarchalNeuralNetwork.prototype.getInputSynapses = function() {
    return this.inputSynapses;
};
HierarchalNeuralNetwork.prototype.getLayers = function() {
    return this.layers;
};
HierarchalNeuralNetwork.prototype.getOutputLayer = function() {
    return this.layers[this.layers.length - 1];
};
HierarchalNeuralNetwork.prototype.getOutputs = function() {
    this.run();
    var outputLayer = this.getOutputLayer();
    var outputs = [];
    for (var i = 0; i < outputLayer.length; i++) {
        outputs[i] = outputLayer[i].getOutput();
    }
    return outputs;
};
HierarchalNeuralNetwork.prototype.initialize = function(layers) {
    this.layers = layers;
    for (var i = 0; i < layers.length - 1; i++) {
        this.conectNeuronsToPostsynapticNeurons(layers[i], layers[i + 1]);
    }
    var inputLayer = this.getInputLayer();
    for (var j = 0; j < inputLayer.length; j++) {
        var neuron = inputLayer[j];
        var synapse = new Synapse();
        this.inputSynapses.push(synapse);
        neuron.addInputSynapse(this, synapse);
    }

};
HierarchalNeuralNetwork.prototype.run = function() {
    for (var i = 0; i < this.layers.length; i++) {
        var neurons = this.layers[i];
        for (var j = 0; j < neurons.length; j++) {
            neurons[j].run();
        }
    }

};
HierarchalNeuralNetwork.prototype.setInputs = function(data) {
    var inputs;
    if (data instanceof Array) {
        inputs = data;
    } else {
        inputs = arguments;
    }
    
    
    for (var i = 0; i < this.inputSynapses.length; i++) {
        this.inputSynapses[i].setInput(inputs[i]);
    }
};
HierarchalNeuralNetwork.prototype.generateWeight = function() {
    var high = 0.3;
    var low = -0.3;
    return Math.random() * (high - low) + low;
};

function Backpropagator(network) {
    this.network = network;
    this.learningRate = 0.75;
    this.stabilityConstant = 0.8;
    this.reporter;
    this.neuronsDelta = {};
    this.synapsesDelta = {};
    this.ALLOWABLE_MARGIN_OF_ERROR = 0.08; // エラーの許容誤差
    this.error;
}
Backpropagator.prototype.learn = function(patterns) {
    var error = this.ALLOWABLE_MARGIN_OF_ERROR + 1.0; // エラーの許容誤差より大きな値

    var howManyTimes = 0;
    // 学習エラーが許容誤差内になるまで繰り返す
    while (howManyTimes < 10 && error > this.ALLOWABLE_MARGIN_OF_ERROR) { // 一連の学習データを繰り返して学習する．
        for (var i = 0; i < patterns.length; i++) {
            var pattern = patterns[i];
            this.network.setInputs(pattern[0]);
            this.network.run();
            this.propagate(pattern[1]);
        }

        // 一連の学習データを繰り返して,誤差を集計する
        error = 0.0;
        for (var i = 0; i < patterns.length; i++) {
            var pattern = patterns[i];
            var inputs = pattern[0];
            var teachSignals = pattern[1];
            this.network.setInputs(inputs);
            for (var k = 0; k < this.network.getOutputs().length; k++) {
                error += Math.pow(
                        teachSignals[k] - this.network.getOutputs()[k], 2.0);
            }
        }
        error *= 0.5;
        this.error = error;
        howManyTimes++;
        if (this.reporter != null) {
            this.reporter.report(howManyTimes, this.network, patterns, error);
        }
    }
};
Backpropagator.prototype.propagate = function(teachSignals) {
    var responseUnits = this.network.getOutputLayer();
    for (var i = 0; i < responseUnits.length; i++) {
        var output = responseUnits[i].getOutput();
        var error = (teachSignals[i] - output)
                * responseUnits[i].getTransferFunction().differentiated(
                output);
        this.delta(responseUnits[i]).error = error;
    }

    var layers = this.network.getLayers();
    for (var i = layers.length - 2; 0 <= i; i--) {
        this.upldatePreviousLayer(layers[i], layers[i + 1]);
    }

    for (var i = 1; i < layers.length; i++) {// 入力層のしきい値は変更しないため1スタート
        var layer = layers[i];
        this.updateBias(layer);
    }
};
Backpropagator.prototype.updateBias = function(layer) {

    for (var i = 0; i < layer.length; i++) {
        var neuron = layer[i];
        this.delta(neuron).biasDelta =
                (this.getLearningRate()
                        * this.delta(neuron).error
                        + this.getStabilityConstant()
                        * this.delta(neuron).biasDelta);
        neuron.setBias(neuron.getBias() + this.delta(neuron).biasDelta);
    }

};
Backpropagator.prototype.upldatePreviousLayer = function(presynapticNeurons, postsynapticNeurons) {
    var key;
    for (key in presynapticNeurons) {
        var presynapticNeuron = presynapticNeurons[key];
        var sum = 0;

        for (key in postsynapticNeurons) {
            var postsynapticNeuron = postsynapticNeurons[key];
            var synapse = postsynapticNeuron
                    .getInputSynapse(presynapticNeuron);

            var deltaWeight = this.getLearningRate()
                    * this.delta(postsynapticNeuron).error
                    * presynapticNeuron.getOutput()
                    + this.getStabilityConstant() * this.delta(synapse).weightDelta;
            this.delta(synapse).weightDelta = deltaWeight;

            synapse.setWeight(synapse.getWeight() + deltaWeight);

            sum += this.delta(postsynapticNeuron).error * synapse.getWeight();
        }
        var output = presynapticNeuron.getOutput();
        this.delta(presynapticNeuron).error = (presynapticNeuron
                .getTransferFunction().differentiated(output) * sum);
    }
};
Backpropagator.prototype.delta = function(data) {
    if (data instanceof Neuron) {
        if (!this.neuronsDelta[data.getId()]) {
            this.neuronsDelta[data.getId()] = new this.NeuronDelta();
        }
        return this.neuronsDelta[data.getId()];
    } else if (data instanceof Synapse) {
        if (!this.synapsesDelta[data.getId()]) {
            this.synapsesDelta[data.getId()] = new this.SynapseDelta();
        }
        return this.synapsesDelta[data.getId()];
    }
};
Backpropagator.prototype.getLearningRate = function() {
    return this.learningRate;
};

Backpropagator.prototype.setLearningRate = function(eta) {
    this.learningRate = eta;
};

Backpropagator.prototype.getStabilityConstant = function() {
    return this.stabilityConstant;
};

Backpropagator.prototype.setStabilityConstant = function(alpha) {
    this.stabilityConstant = alpha;
};
Backpropagator.prototype.NeuronDelta = function() {
    this.biasDelta = 0.0;
    this.error = 0.0;
};
Backpropagator.prototype.SynapseDelta = function() {
    this.weightDelta = 0.0;
};
Backpropagator.prototype.setReporter = function(reporter) {
    this.reporter = reporter;
};
Backpropagator.prototype.getError = function() {
    return this.error;
};