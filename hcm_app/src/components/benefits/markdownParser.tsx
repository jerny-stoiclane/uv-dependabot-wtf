import { Link, Text } from '@react-pdf/renderer';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

export const formatCovered = (covers: string[]) => covers.join('\n');

export const convertMarkdownToPdf = (markdown: string | null) => {
  if (!markdown) return [];
  const html = renderMarkdownToHtml(markdown);
  return renderHtmlToPdf(html);
};

export const renderMarkdownToHtml = (markdown: string) => {
  const html = remark().use(remarkHtml).processSync(markdown).toString();
  return html;
};

export const renderHtmlToPdf = (html: string) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const elements: React.ReactNode[] = [];

  const walk = (node: ChildNode, key: string): React.ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) {
      return <Text key={key}>{node.nodeValue}</Text>;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      switch (element.tagName.toLowerCase()) {
        case 'h4':
          return (
            <Text
              key={key}
              style={{
                fontSize: 16,
                fontFamily: 'Helvetica-Bold',
                fontWeight: 'bold',
                marginBottom: 5,
              }}
            >
              {walkChildren(element, key)}
            </Text>
          );
        case 'p':
          return (
            <Text key={key} style={{ marginBottom: 5 }}>
              {walkChildren(element, key)}
            </Text>
          );
        case 'a':
          return (
            <Link key={key} src={element.getAttribute('href') || ''}>
              <Text style={{ color: '#1677ff', textDecoration: 'none' }}>
                {walkChildren(element, key)}
              </Text>
            </Link>
          );
        case 'strong':
          return (
            <Text
              key={key}
              style={{ fontFamily: 'Helvetica-Bold', fontWeight: 'bold' }}
            >
              {walkChildren(element, key)}
            </Text>
          );
        case 'em':
          return (
            <Text key={key} style={{ fontStyle: 'italic' }}>
              {walkChildren(element, key)}
            </Text>
          );
        case 'li':
          return (
            <Text key={key} style={{ marginBottom: 5 }}>
              • {walkChildren(element, key)}
            </Text>
          );
        default:
          return null;
      }
    }
    return null;
  };

  const walkChildren = (
    parent: HTMLElement,
    parentKey: string
  ): React.ReactNode[] => {
    const childNodes = Array.from(parent.childNodes);
    const childElements: React.ReactNode[] = [];
    childNodes.forEach((childNode, index) => {
      const key = `${parentKey}-${index}`;
      const walkedChild = walk(childNode, key);
      if (walkedChild !== null) {
        childElements.push(walkedChild);
      }
    });
    return childElements;
  };

  walkChildren(tempDiv, 'root').forEach((element) => {
    if (element !== null) {
      elements.push(element);
    }
  });

  return elements;
};
