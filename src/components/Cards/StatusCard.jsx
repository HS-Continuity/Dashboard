import { Card } from 'antd';

const { Meta } = Card;

const hexToRgbA = (hex, alpha) => {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
  } else {
    console.error('Bad Hex: ' + hex);
  }
  throw new Error('Bad Hex: ' + hex);
};

const StatusCard = ({ title, count, color }) => {

  const backgroundColor = hexToRgbA(color, 0.13);

  return (
    <Card 
      style={{ 
        width: '115px', 
        height: '55px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' ,
        backgroundColor: backgroundColor, // 배경색 설정
      }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: color}}>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{title}</span> 
        <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{count}건</span> 
        
      </div>
      {/* <Meta  style={{ fontSize: '15px', fontWeight: 'bold' }}title={title} /> */}
      {/* {count}건 */}
    </Card>
  );
};

export default StatusCard
