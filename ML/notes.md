## ***– Chapter 1: Machine Learning Basics***

#### describe the basic concepts involved in machine learning and the importance of machine learning.

- ML is about improving the performance P of a task T based on experiences E
- optimisation - finding the best inputs which max (or min) the output
- data will have features. We represent this with a feature vector
- Compare predicted results against ground truth and then compute a loss function which is based on how many predictions we got wrong.

![image.png](attachment:3372732d-8185-4d2c-bdcd-fae36f860538:image.png)

#### distinguish between the typical machine learning tasks.

- Learning methods
    - supervised - input/output pairs are used to train
        - classification - grouping inputs into classes
            - binary - one of 2 classes
            - multi - one of many classes
            - multi-label - some of many classes
            - structured - tree like structure
        - regression - output is a continuous value
    - unsupervised - data is untagged. Model finds hidden patterns and structure
    - reenforcment - reward/punishment based on action taken

#### link a real-world machine learning application to possible machine learning task setups.

- supervised: face id, speech to text, object detection
- unsupervised: data visualisation, document classification
- reinforcement: automated cars, trading, games

#### refreshed your basic maths knowledge and Python programming skills, and be prepared to implement basic mathematical operations in Python.

```python
import numpy as np

#feature vector
x= np.array([2,3])

#weights
w = np.array([0.5,1.2])

#prediction
y_pred = np.dot(x,w)
```

## – Chapter 2: k-Nearest Neighbours

#### explain how a k-nearest neighbour approach works, and to apply it to solve both classification and regression tasks.

- Measure distance between data point and training data points
- sort by distance and pick K nearest ones
    - classifcation - pick the most common class of the K points
    - regression - calculate the average of the K points

#### explain the effects of training data and neighbour number.

- training data
    - small training data = insufficent for good results
    - big training data = good results but needs time + money
        - big set only good if not noisy - noisy = less accurate predictions
- neighbour number (K)
    - This is a hyperparemeter - if we change this, we make a new model
    - small k = noisy model  big K = too many samples affecting prediction

#### determine appropriately the choice of distance measure and the neighbour number.

- neighbour number
    - can be selected by running K for certain values and compare the error rates
- distance measure
    - Eucliean
    - Similarity measure
        
        ![image.png](attachment:3124b789-1345-40a1-a76c-7dc7ac82ceae:image.png)
        

#### implement the k-NN approach in Python.

```python
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score
#x=feature matrix y=labels
X_train, X_test, y_train, y_test = train_test_split(X, 
																										y, 
																										test_size=0.7, 
																										random_state=42)
# Create and fit the k-NN classifier
k = 5  # number of neighbors to consider
knn_classifier = KNeighborsClassifier(n_neighbors=k)
knn_classifier.fit(X_train, y_train)

# Make predictions on the test set
y_pred = knn_classifier.predict(X_test)

# Evaluate the classifier using accuracy_score
accuracy = accuracy_score(y_test, y_pred)
```

## – Chapter 3: Machine Learning Experiments

#### explain typical measures for evaluating classification and regression performance by using samples, and discuss their differences.

- Classification
    - Error is when we misclass a sample
    - accuracy = correct/total     error = wrong/total
    - Confusion matix
        - for each we make a matrix where collumn = true a, not a   row = predicted a, not a
        - precision = TP/(TP+FP)       recall = TP/(TP+FN)
        - F1 = 2*P*R/(P+R)                  Specificity = TN/(TN+FP)
- Regression
    - Error is measured by the difference between the real and predicted value using different methods
        - RMSE = $\sqrt{\frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2}$     MAE = $\frac{1}{n} \sum_{i=1}^{n} \left| y_i - \hat{y}_i \right|$
        - R^2 = $1 - \frac{\sum_{i=1}^{n} (y_i - \hat{y}_i)^2}{\sum_{i=1}^{n} \left( y_i - \frac{1}{n} \sum_{i=1}^{n} y_i \right)^2}$    Where y = real    $\hat{y}$= predicted

#### discuss the relationship between the true error and sample error of a machine learning model, and discuss potential issues caused by limited data.

- Sample error - Error we measured in our dataset vs the ground truth
- Total error - Expected error over the entire data distribution
- issues of limited data
    - bias - this will result in a skewed/ poor estimate for predicted values (underfit)
    - variance - data too noisy to get good generalisation (overfit)

#### apply simple statistical approaches to decide how confident your sample error is in evaluation.

- We use a confidence interval to check if the difference between 2 models is significant
    - error of sample $\pm$ a
    - $a = z_p \sqrt{\frac{error_s (1 - error_s)}{n}}$
        - zp is the  value depending on our prob p value from the z curve
        - we then compute $C = 1 - \frac{(1 - p)}{2}$ ← prob that A has higher true error than B
        
        ![image.png](attachment:1847e863-1a45-47e5-9a22-5804291fbe47:image.png)
        

#### explain different data-splitting strategies for model training, testing and selection, and apply the knowledge to design and implement appropriate machine learning experiments.

- Random subsampling
    - split dataset into K samples
    - in each sample, randomly select test data - then the rest is training data
    - compute error for each and average for total error ($\text{total error} = \frac{\sum e_i}{k}$
- K fold cross validation
    - split into k parts
    - use k-1 to train and 1 to test
    - repeat this for all parts
- Bootstrap (sample with replacement)
    - sample n times to train
    - anything not sampled is used to test
    - repeat this K times

## – Chapter 4: Machine Learning Models

#### explain typical approaches and apply the knowledge to construct prediction functions required by classification/regression tasks.

- deterministic model - Maps input to a clear output
    - classification: maps input a class
    - regression: maps input to output value
- probablistic inference - Find posterior for class, compute for all K classes
    - classification: $p(\text{class } k \mid x)$
    - regression:  $p(f \mid x)$
- Bayes modelling - find posteriror from likelyhood and prior
    - $P(a \mid x) = \frac{P(x \mid a)\, P(a)}{P(x)}$
        - classification: a = class k             regression: a = f

#### explain the difference between probabilistic and deterministic models, also between linear and nonlinear models.

- Probabilistic can give uncertaintanty.
    - value is given as a probability rather than a single label/value
- Linear model
    - parametric model using a function in linear form
        - In the form: $f(x) = w_1 x + x_0$
        - train to find best weights
    - classification
        - binary: if f is ≥0, class =a else b
        - if we set f =0 we can find the hyperplane - decision boundary
        - instead of this we could use logistical regression
        
        ![image.png](attachment:15ba3b85-190d-4647-ab70-270a730193ac:image.png)
        
        - probablistic binary: sigmoid function $\sigma(x) = \frac{1}{1 + e^{-x}}$
    - Regression
        - non-probablistic: use output of $f(x) = w_n x^n +... +w_1 x + x_0$
        - probablistic: estimate $p(f|x)$
            - This could be done using a gaussian distribution $p(f \mid x) = \mathcal{N}(W^\top \tilde{x},\ \sigma^2)$
            - Noise can be added: $\hat{y} = W^\top x + \epsilon$
- Non-Linear
    - Each data point is mapped to a new feature space using non-linear function
        - we want to find a linear pattern in this non-linear space
    - linear basis function model
        - each point mapped non-linearly (using a basis function)
        - these are then used to make a linear model
        
        ![image.png](attachment:6886fc6c-aec5-4cb0-a032-7d86be45f97a:image.png)
        
    - Kernel method
        - inner product between 2 data points is the correlation betwen them
            - original space: $\mathbf{x}_i^{T} \mathbf{x}_j = \sum_{k=1}^{d} x_{ik} x_{jk}$
            - non-linear: $\phi(x_i)^{T}\, \phi(x_j) = \sum_{k=1}^{D} \phi_k(x_i)\, \phi_k(x_j)$
        - Kernel allows us to avoid defining **Φ**
            - $\phi(x_i)^{T}\phi(x_j) = K(x_i, x_j)$
            
            ![image.png](attachment:71079d56-d145-4d56-9d7c-1243cc22d30d:image.png)
            
            - in the linear function we replace w with $\sum_{i=1}^{n} a_i \, \phi(x_i)$
                - our new prediction function becomes:
                    - $f(x) = \sum_{i=1}^{n} a_i\, k(x_i, x) + w_0$
                    - train to find best a

## – Chapter 5: Loss Functions

#### explain the typical approaches to construct loss functions for training regression and classification models.

- data is used to train model parameters - these need to be optimised
- use a loss function and minimise this to optimise parameters
- regression
    - non prob
        - sum of square loss = $\frac{1}{2} \sum_{i=1}^{n} \sum_{j=1}^{m} (\hat{y}_{i,j} - y_{i,j})^2$
        - mean square loss = $\frac{1}{2} \sum_{i=1}^{n} (\hat{y}_{i} - y_{i})^2$
        - linear least squares = $\frac{1}{2} \sum_{i=1}^{n} \left( W^T x_i - y_i \right)^2 \;+\; \frac{\lambda}{2} |W^TW|$
            - the last bit is regularisation used to prevent overfitting
            - lamda is set by user
    - prob
        - maximise likelihood
            - $\mathcal{L}(\theta) = \prod_{i=1}^{n} p(x_i, y_i \mid \theta)$
            - assume gausian distribution - $p(y_i \mid x_i, \theta) = \mathcal{N}(y_i \mid W^T x_i, \sigma^2)$
            - take the log of the likelihood
            - $\sum_{i=1}^{n} \left[ \log \frac{1}{\sqrt{2\pi\sigma^2}} \;-\; \frac{(y_i - W^T x_i)^2}{2\sigma^2} \right]$
            - = $\min_W \sum_{i=1}^{n} (y_i - W^T x_i)^2$ - this comes down to squared loss
- classification
    - non prob
        - least squares - $\frac{1}{2} \sum_{i=1}^{n} (f(x_{i}) - y_{i})^2$
            - y hat determined by a discriminant function
            - have a threshold - if f(x) is greater than threshold, then its one class else its other class
        - hinge loss function
            - $\frac{1}{2}|W^TW| + C \sum_{i=1}^{n} \max\left(0,\, 1 - y_i\, (W^T x_i + w_{0}) \right)$
    - prob
        - cross entrophy - distance between probabliity distribution
            - do this based on posterior
            - H(p,q) = -[p(1)log(q(1)) + p(0)log(q(0))]
            - sub in probs and subtract misses
            - $\sum_{i=1}^{n} \left[ y_i \log p(y=1 \mid x_i) - (1 - y_i)\log p(y=0 \mid x_i) \right]$
        - maximise likelihood
            - max(p(y|theta))
            - $p(y \mid \theta) = \begin{cases} \theta & \text{if } y = 1 \\ 1 - \theta & \text{else} \end{cases}$
            - this can also be done for multiclass
                - $p(y \mid \theta_1, \theta_2, \dots, \theta_K) = \prod_{k=1}^{K} \theta_k^{y_k}$
                - where y is [y1,y2,y3,…] - will be 1 in 1-k class rest are 0
        - negative loss likelyhood loss
            - $\mathcal{L} = - \sum_{i=1}^{n} \left[ y_i \log \theta(x_i) + (1 - y_i)\log \big(1 - \theta(x_i)\big) \right]$
            - equal to cross entrophy loss if $\theta(x) = p(y=1 \mid x)$ or $\theta_k(x) = p(y = c_k \mid x)$
                - $\theta(x) =  \frac{1}{1 + \exp(-W^T x)}$
                - $\theta_k(x) = \frac{\exp(W_k^T x)}{\sum_{j=1}^{K} \exp(W_j^T x)}$
            

#### calculate the taught losses for a specified prediction function using the provide training samples.

## – Chapter 6: Training and Optimisation

#### explain the typical approaches to train a machine learning model.

- optimisation - find max or min value based on loss function
    - giving function and inputs - min value is where dy/dx = 0
- so we can do this for Linear least squares & L2-regularised least squares

#### implement the linear least squares solution and its l2 regularised version, also typical gradient descent based iterative training approaches, and apply the knowledge to solve practical classification and regression tasks.

- Linear least squares $O(w)=1/2 ​∥X~w−y∥^2_2​$
- when we differenitate and set to 0 we get
    - $\mathbf{w} = \left(\tilde{\mathbf{X}}^{T}\tilde{\mathbf{X}}\right)^{-1}\tilde{\mathbf{X}}^{T}\mathbf{y}$
    - which can be simplied to
        - $\mathbf{w} = \tilde{\mathbf{X}}^{\dagger}\mathbf{y}$ - psuedoinverse
- for L2, regularisation adds a penalty
    - $\frac{1}{2} \sum_{i=1}^{N} \left(y_i - \mathbf{w}^{T}\mathbf{x}_i\right)^2 + \frac{\lambda}{2} \mathbf{w}^{T}\mathbf{w}$
    - so we get $\mathbf{w} = \left(\tilde{\mathbf{X}}^{T}\tilde{\mathbf{X}} + lamda I\right )^{-1}\tilde{\mathbf{X}}^{T}\mathbf{y}$
- iterative optimisation + training
    - start at random guess and apply a change to it
        - change is aimed to reduce value of objective functino
        - this is the way we update: $θ(t+1)=θ(t)−η∇O(θ(t))$
            - η - is learning rate
            - ∇O(θ) - gradient
    - gradient descent for least squares
        - w(t+1)=w(t)−η(X~TX~w(t)−X~Ty)
    - normal GD - use all training samples
        - θ(t+1)=θ(t)−ηsum(∇O(θ(t)))
    - stochastic GD - updates using 1 training sample
        - θ(t+1)=θ(t)−η∇O(θ(t))
    - mini-batch GD - updates only with subset of  training samples
        - θ(t+1)=θ(t)−η sum(∇O(θ(t)))

#### do simple calculation regarding to training linear models with 1 or 2 input/output.

- training linear model with 1 input 1 output
    - y^=w1x+w0
    - loss function = O(w1,w0)=21i=1∑N(w1xi+w0−yi)2
    - differeniate for both weights and set to 0
        - i=1∑N(w1xi+w0−yi)=0
        - ∑i=1N(w1xi+w0−yi)xi=0\sum_{i=1}^{N}
        (w_1x_i+w_0-y_i)x_i=0i=1∑N(w1xi+w0−yi)xi=0
        - solve for ws
    - update step
        - find next gradient using: w(t+1)=w(t)−η∂w∂O

## – Chapter 7: Artificial Neural Networks

#### explain basic neural network architectures, e.g., the single neuron, single-layer perceptron and multi-layer perceptron models. Y

- neural network is inspired by brain - collection of artifical neurons
- nueron model - takes in multiple inputs and gives one output
    - inputs are multiplied by weights and summed together to get output
    - y = a(sum(wi * x*)+ b)
        - a is activation function - could be identity,threshold,sigmoid or relu
        - b is bias
- single layer
    - layer of nuerrons where input is connected to all neurons
    - and each nueron produces output
    - can have hidden layers to allow for more complex functions
- multi layer
    - multiple layers used where outputs are connected to all neurons in next layers
    - multiple hidden layers can be used
    - output layer acts as linear projection at end of network
    - the number of layers and nuerons are hyper parameters

#### explain the typical approaches of training these models.

- hebbiean learning rule - the more a synanpse used, more strong it should be
    - change in w = F(wi,zi)
    - eg: w^t = w^t-1 + $\eta$x*z
    - start with random and improve
- gradient descent
    - take the nueral network weight and linear prediction weights and use a loss function
    - minimise this by setting gradient to 0
    - more accurate by hebbiean
- preceptron alg
    - train single neuron by minimising percepton criteria using gradient decent
    - iteratively update weights
    - then do gradient decent on loss function

#### apply the knowledge to solve practical classification and regression tasks using neural networks.

#### explain the backpropagation technique, and be able to calculate the loss function value and its gradient with respect to the neural network weights for simple neural networks.

- feedforward - calcluates loss    backprop - calculates weight using loss
- uses chain rule to complete gradient for each layer
- calculates error distributions for each nueron after processing data
- may be regulated - O(W) = loss(W) + $\lambda$1/2

## – Chapter 8: Deep Learning Models

#### learn about deep learning.

- deep learning is when learning is done by nueral network
- learns patterns from data

#### explain the key difference between traditional machine learning and deep learning.

- normal method: feature extraction → feature refinement → manual feature engineering
- deep learning removes the manual feature tuning by having nueral network learn from the data
- issue is that this can result in black boxing - from not understanding how model makes decision
- also is hard to train
    - pre-train - someone else has pre-trained model - build off that
    - batch normalisation - normalise output of hidden layer in batches
    - skip connections -
    - regularisation - used to prevent overfitting

#### Have understanding about key techniques in deep learning, and the convolutional neural network architecture.

- CNN - mainly used for image data
    - can be 2d or 3d layer
    - has many hidden layers
    - convolution layer
        - local connectivitiy - each neuron connected to only a small region in previous layer
        - weight sharing - one filter size of local region slides over all locations
            - produces an activation map
            - stride - depends on how many nuerons we shift
        - activation map size
            - 2d: $\left( \frac{n - f}{s} + 1 \right) \times \left( \frac{n - f}{s} + 1 \right)$   n= input size, f = filter size, s= stride
            - 3d: $\left( \frac{n_1 - f_1}{s} + 1 \right) \times \left( \frac{n_2 - f_2}{s} + 1 \right)$
    - pooling layer
        - takes activation map and reduces size
        - prevents overfitting and makes features more robust
    - fully connected layer
        - every neutron is connected to every neutron in previous layer
        - flatten - before FC, the 2d/3d feature map is turned into a 1d vector
        - apply MLP
- RNN
    - mainly used for seqence data
    - like text and sentences

## - Chapter 9: Cluster Analysis

#### explain typical concepts and key tasks, discuss challenges of clustering.

- clutering - grouping data points together based on some kind of similarity between them
    - need some way to show what “similar” means - use features
    - data points can be sperated into clusters by using features, distance metric and evaluation
- unsupervised learning but need to specify similar and distance metric
- 

#### calculate distance between data clusters.

- each cluster will have a centre point
- we can measure the distance between this and our current data point
- single-link - smallest distance between 2 closest data points from each other in 2 different clusters
- complete-link - largest distance between 2 further data points from each other in 2 different clusters
- average-link - average distance between all points in both clusters

#### explain  the k-means clustering and agglomerate clustering approaches, and perform relevant calculation, and apply them in practical clustering tasks.

- k-means
    - steps
        - start with a centre point for each cluster (could be random)
        - add in a new data point and measure its distance from each centre (eg: eucliean)
        - whichever it is closest too, add it to that cluster
        - recalulate the centre as the mean of all the points in that cluster
    - O(TKN) complexity: T= iterations   K=clusters    N=datapoints
    - however need to specify number of clusters - sensitive to outliers too
- agglomerate clustering
    - steps
        - each data point is treated as its own cluster
        - calculate distance between each point and every other point
        - merge 2 closest clusters
        - repeat this till all in 1 big cluster
    - data is stored in matrix
        - size starts as NxN
        - each iteration this will change
            
            ![image (2).png](attachment:66c68a13-5501-4632-a326-bbb905e1f7a5:image_(2).png)
            
    - this produces a tree showing lifetime of clusters
        - can choose where to cut depending on what you want the cluster to be
        - no need to specify how many clusters
    - not efficent tho - O(N^2 LogN)   N = data points
- cluster methods:
    - centroid: represent cluster by center vector - like k means
    - hierarchial: merge and divide - like agglomerative
    - distribution based: assume objetcs of same cluster should have same data distribution

#### explain approaches for evaluating the quality of obtained clusters, and perform relevant calculation.

- validation
    - internal - use common sense
        - within-cluster variance (SSW) = $\sum_{i=1}^{k} \sum_{x_p \in clusters} d^2(x_p, c_i)$
        - between-cluster variance (SSB) = $\sum_{i=1}^{k} n_i \, d^2(c_i, c)$
        - f-ratio index = $K \cdot \frac{\text{SSW}}{\text{SSB}}$
    - external - evaulate against ground truth
        - compare GT label to labels of data points
        - rand index
            
            ![image.png](attachment:aa80960c-e4f6-409d-873a-56fd5dd4b0ca:image.png)
            

## - Chapter 10: ML applications

#### explain typical challenges encountered in real-world machine learning applications, including data processing (e.g., missing values, imbalanced data, noisy and high-dimensional features) and model selection (e.g., model interpretability, model complexity).

- ML pipeline: select model, prepare data, train, evaulate
- challenges
    - data prep
        - normalisation and standarisation - solution: feature scaling
            - $x_{scale} = \frac {x-x_{min}}{x_{max}-x_{min}}$ - normalise
            - $x_{scale} = \frac {x-\mu }{\sigma}$ - standarisation
        - missing values - solution: delete or imputation
        - mulit-modal data intergration - solution: fuse features
        - imbalanced/outliers - solution: weighted learning
        - noisy data - solution: denoise and do batch training
        - high dimension - solution: deduce dimension by feature latterning
    - model selection
        - model interpretability - how understanable is model stucture
            - same for results
        - model complexity

#### recognise and discuss recent real-world applications of machine learning, with a particular emphasis on digital health.

![image.png](attachment:4a9e3bc0-e0c2-4f8c-a45d-7aa22a07f85a:image.png)

- digital health - using technology to improve or help healthcare
- why
    - save cost and time
    - lots of big datasets
- medical image analysis - CNN for cancer detection and predictions
- use data like genomics,imaging,etc for classifcation of diseases
- drug discovery - predict protien structures - speed up drug discovery
- ai chatbot for healthcare + ml hardware for wearable measuring things

#### reflect on current research progress and consider how machine learning can be further applied and explored beyond the classroom.

- current progress - lots of breakthoughs
    - big research output
- challenges
    - data limitations, model complexity