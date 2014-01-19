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
describe("Neuron", function() {
    var neuron;

    it("should connect to another one.", function() {
        var pre = new Neuron();
        var post = new Neuron();
        pre.connect(post);

        expect(pre.getOutputSynapse(post)).toBe(post.getInputSynapse(pre));
    });
});


describe("HierarchalNeuralNetwork", function() {
    var network;

    beforeEach(function() {
        network = new HierarchalNeuralNetwork(2, 2, 1);
    });

    it("should construct a neural network.", function() {
        var inputLayer = network.getLayers()[0];
        var hiddenLayer = network.getLayers()[1];
        var outputLayer = network.getLayers()[2];

        expect(inputLayer[0].getTransferFunction() instanceof  PassThroughFunction).toBe(true);
        expect(inputLayer[1].getTransferFunction() instanceof  PassThroughFunction).toBe(true);

        expect(network.getInputSynapses()[0])
                .toBe(inputLayer[0].getInputSynapse(network));

        expect(network.getInputSynapses()[1])
                .toBe(inputLayer[1].getInputSynapse(network));

        expect(inputLayer[0].getOutputSynapse(hiddenLayer[0]))
                .toBe(hiddenLayer[0].getInputSynapse(inputLayer[0]));
        expect(inputLayer[0].getOutputSynapse(hiddenLayer[1]))
                .toBe(hiddenLayer[1].getInputSynapse(inputLayer[0]));

        expect(inputLayer[1].getOutputSynapse(hiddenLayer[0]))
                .toBe(hiddenLayer[0].getInputSynapse(inputLayer[1]));
        expect(inputLayer[1].getOutputSynapse(hiddenLayer[1]))
                .toBe(hiddenLayer[1].getInputSynapse(inputLayer[1]));

        expect(hiddenLayer[0].getOutputSynapse(outputLayer[0]))
                .toBe(outputLayer[0].getInputSynapse(hiddenLayer[0]));
        expect(hiddenLayer[1].getOutputSynapse(outputLayer[0]))
                .toBe(outputLayer[0].getInputSynapse(hiddenLayer[1]));
    });

    it("should run.", function() {
        for (var i = 0; i < network.getLayers().length; i++) {
            var layer = network.getLayers()[i];
            for (var j = 0; j < layer.length; j++) {
                var neuron = layer[j];
                for (var k in neuron.getOutputSynapses()) {
                    neuron.getOutputSynapses()[k].setWeight(1);
                }
            }
        }

        network.setInputs(0, 1);
        network.run();

        var sigmoidFunction = new SigmoidFunction();
        var input_1 = 0;
        var input_2 = 1;

        var hidden_1 = sigmoidFunction.execute(input_1 + input_2);
        var hidden_2 = sigmoidFunction.execute(input_1 + input_2);

        var response = sigmoidFunction.execute(hidden_1 + hidden_2);

        expect(network.getInputLayer()[0].getOutput()).toBe(input_1);
        expect(network.getInputLayer()[1].getOutput()).toBe(input_2);
        var hiddenLayer = network.getLayers()[1];
        
        expect(hiddenLayer[0].getOutput()).toBe(hidden_1);
        expect(hiddenLayer[1].getOutput()).toBe(hidden_2);
        
        expect(network.getOutputs()[0]).toBe(network.getLayers()[2][0].getOutput());
        expect(response).toBe(network.getOutputs()[0]);

    });
});

describe("BackPropagator", function() {

    it("should propagate.", function() {

        var network = new HierarchalNeuralNetwork(2, 2, 1);

        var sensoryLayer = network.getLayers()[0];
        var associateLayer = network.getLayers()[1];
        var responseLayer = network.getLayers()[2];
        
        sensoryLayer[0].getOutputSynapse(associateLayer[0]).setWeight(0.1);
        sensoryLayer[0].getOutputSynapse(associateLayer[1]).setWeight(0.234);
        sensoryLayer[1].getOutputSynapse(associateLayer[0]).setWeight(-0.2);
        sensoryLayer[1].getOutputSynapse(associateLayer[1]).setWeight(0.123);

        
        associateLayer[0].getOutputSynapse(responseLayer[0]).setWeight(-0.123);
        associateLayer[1].getOutputSynapse(responseLayer[0]).setWeight(0.1);

        

        var backpropagator = new Backpropagator(network);
        backpropagator
                .learn([
                    [[0, 1], [1]],
                    [[1, 1], [0]],
                    [[1, 0], [1]],
                    [[0, 0], [0]]
                ]);

        
        expect(sensoryLayer[0].getOutputSynapse(associateLayer[0]).getWeight()).toBeAlmostEqual(2.24089413758955);
        expect(sensoryLayer[0].getOutputSynapse(associateLayer[1]).getWeight()).toBeAlmostEqual(5.610786934041788);
        expect(sensoryLayer[1].getOutputSynapse(associateLayer[0]).getWeight()).toBeAlmostEqual(2.2208661997727495);
        expect(sensoryLayer[1].getOutputSynapse(associateLayer[1]).getWeight()).toBeAlmostEqual(5.125745563834208);
        expect(associateLayer[0].getBias()).toBeAlmostEqual(-3.17798013416249);
        expect(associateLayer[1].getBias()).toBeAlmostEqual(-1.6327273846433468);
        expect(associateLayer[0].getOutputSynapse(responseLayer[0]).getWeight()).toBeAlmostEqual(-5.3412305443889645);
        expect(associateLayer[1].getOutputSynapse(responseLayer[0]).getWeight()).toBeAlmostEqual(5.400880608587149);
        expect(responseLayer[0].getBias()).toBeAlmostEqual(-2.3846121378010734);
    });
});