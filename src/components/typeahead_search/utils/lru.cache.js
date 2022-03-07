class Node {
  constructor(value) {
    this.val = value;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  push(value) {
    var newNode = new Node(value);
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
    }
    this.length++;
    return newNode;
  }

  unshift(value) {
    var newNode = new Node(value);
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.head.prev = newNode;
      newNode.next = this.head;
      this.head = newNode;
    }
    this.length++;
    return newNode;
  }

  pop() {
    if (this.head === null) {
      return undefined;
    }
    var poppedNode = this.tail;
    if (this.length === 1) {
      this.tail = null;
      this.head = null;
    } else {
      var prevOfTail = poppedNode.prev;
      this.tail = prevOfTail;
      prevOfTail.next = null;
    }
    this.length--;
    return poppedNode;
  }
}

export class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();

    this.dll = new DoublyLinkedList();
  }
  reorder(key, value) {
    let { currentNode } = this.map.get(key);
    if (currentNode === this.dll.head) {
      this.map.set(key, { currentNode, value });
    } else if (currentNode === this.dll.tail) {
      this.dll.pop();
      var updatedNode = this.dll.unshift(key);
      let mapValue = {
        currentNode: updatedNode,
        value,
      };
      this.map.set(key, mapValue);
    } else {
      if (currentNode.prev) {
        currentNode.prev.next = currentNode.next;
      }
      if (currentNode.next) {
        currentNode.next.prev = currentNode.prev;
      }
      currentNode.next = this.dll.head;
      currentNode.prev = null;
      this.dll.head.prev = currentNode;
      this.dll.head = currentNode;
      let mapValue = {
        currentNode: this.dll.head,
        value,
      };
      this.map.set(key, mapValue);
    }
  }
  getItem(key) {
    if (this.map.has(key)) {
      let { value } = this.map.get(key);
      this.reorder(key, value);
      return value;
    } else {
      return -1;
    }
  }
  setItem(key, value) {
    if (this.map.has(key) === false) {
      if (this.map.size >= this.capacity) {
        let poppedNode = this.dll.pop();
        this.map.delete(poppedNode.val);
      }
      let currentNode = this.dll.unshift(key);
      let mapValue = {
        currentNode,
        value,
      };
      this.map.set(key, mapValue);
    } else {
      this.reorder(key, value);
    }
  }
}
