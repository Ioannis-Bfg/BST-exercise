class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  buildTree(array) {
    const uniqueArray = [...new Set(array)];
    const sortedArray = mergeSort(uniqueArray);

    let start = 0;
    let end = sortedArray.length - 1;

    const build = (start, end) => {
      if (start > end) {
        return null;
      }
      let mid = Math.floor((start + end) / 2);
      let node = new Node(sortedArray[mid]);

      node.left = build(start, mid - 1);
      node.right = build(mid + 1, end);

      return node;
    };

    return build(start, end);
  }

  prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }

  insert(value) {
    let currentNode = this.root;
    if (!currentNode) {
      this.root = new Node(value);
      return;
    }

    let temp = new Node(value);
    while (currentNode.left != null || currentNode.right != null) {
      if (value < currentNode.value) {
        if (currentNode.left === null) {
          break;
        }
        currentNode = currentNode.left;
      } else {
        if (currentNode.right === null) {
          break;
        }
        currentNode = currentNode.right;
      }
    }

    if (value < currentNode.value) {
      currentNode.left = temp;
    } else {
      currentNode.right = temp;
    }
  }

  levelOrder(callback) {
    if (!this.root) return [];

    const queue = [this.root];
    const result = [];

    while (queue.length > 0) {
      const node = queue.shift();
      if (callback) {
        callback(node.value);
      } else {
        result.push(node.value);
      }
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    return result;
  }

  inOrder(callback) {
    const result = [];

    const traverse = (node) => {
      if (!node) return;
      traverse(node.left);
      if (callback) {
        callback(node.value);
      } else {
        result.push(node.value);
      }
      traverse(node.right);
    };

    traverse(this.root);

    return result;
  }

  preOrder(callback) {
    const result = [];

    const traverse = (node) => {
      if (!node) return;
      if (callback) {
        callback(node.value);
      } else {
        result.push(node.value);
      }
      traverse(node.left);
      traverse(node.right);
    };

    traverse(this.root);

    return result;
  }

  postOrder(callback) {
    const result = [];

    const traverse = (node) => {
      if (!node) return;
      traverse(node.left);
      traverse(node.right);
      if (callback) {
        callback(node.value);
      } else {
        result.push(node.value);
      }
    };

    traverse(this.root);

    return result;
  }

  height(node) {
    if (!node) return -1;
    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);
    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(node) {
    if (!node) return -1; // Depth of null node is -1
    let depth = 0;
    while (node !== this.root) {
      node = this.searchParent(node);
      depth++;
    }
    return depth;
  }

  searchParent(node) {
    if (!node) return null;
    return this.findParent(this.root, node);
  }

  findParent(root, node) {
    if (!root || root === node) return null;
    if (root.left === node || root.right === node) return root;
    return (
      this.findParent(root.left, node) || this.findParent(root.right, node)
    );
  }

  isBalanced() {
    return this.checkBalanced(this.root);
  }

  checkBalanced(node) {
    if (!node) return true;

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    if (Math.abs(leftHeight - rightHeight) > 1) {
      return false;
    }

    return this.checkBalanced(node.left) && this.checkBalanced(node.right);
  }

  rebalance() {
    const nodesArray = this.inOrder();

    this.root = this.buildTree(nodesArray);
  }
}

// ////////////////////////MERGESORT /////////////////

function mergeSort(array) {
  if (array.length <= 1) {
    return array;
  }

  let midIndex = Math.floor(array.length / 2);
  let firstHalf = array.slice(0, midIndex);
  let secondHalf = array.slice(midIndex);

  firstHalf = mergeSort(firstHalf);
  secondHalf = mergeSort(secondHalf);

  return merge(firstHalf, secondHalf);
}

function merge(firstHalf, secondHalf) {
  let mergedArray = [];
  let i = 0,
    j = 0;

  while (i < firstHalf.length && j < secondHalf.length) {
    if (firstHalf[i] < secondHalf[j]) {
      mergedArray.push(firstHalf[i]);
      i++;
    } else {
      mergedArray.push(secondHalf[j]);
      j++;
    }
  }

  while (i < firstHalf.length) {
    mergedArray.push(firstHalf[i]);
    i++;
  }

  while (j < secondHalf.length) {
    mergedArray.push(secondHalf[j]);
    j++;
  }

  return mergedArray;
}

// ////////////////////////////////////////////////////////////////////

const array = [30, 20, 100, 500, 10];
const tree = new Tree(array);
console.log("Tree before rebalancing:");
tree.prettyPrint();

tree.rebalance();
console.log("Tree after rebalancing:");
tree.prettyPrint();
